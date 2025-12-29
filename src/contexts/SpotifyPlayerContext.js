import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  getAccessToken,
  isAuthenticated,
  getAuthCodeFromUrl,
  exchangeCodeForToken,
  cleanupAuthUrl,
  checkPremiumStatus,
  initiateSpotifyLogin,
  clearTokens
} from '../utils/spotifyAuth';

const SpotifyPlayerContext = createContext(null);

export function useSpotifyPlayer() {
  const context = useContext(SpotifyPlayerContext);
  if (!context) {
    throw new Error('useSpotifyPlayer must be used within a SpotifyPlayerProvider');
  }
  return context;
}

export function SpotifyPlayerProvider({ children }) {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [hasPremium, setHasPremium] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const playerRef = useRef(null);
  const accessTokenRef = useRef(null);

  // Handle OAuth callback
  useEffect(() => {
    async function handleAuthCallback() {
      try {
        const code = getAuthCodeFromUrl();
        if (code) {
          setIsAuthenticating(true);
          const token = await exchangeCodeForToken(code);
          accessTokenRef.current = token;
          cleanupAuthUrl();
          
          // Check premium status
          const isPremium = await checkPremiumStatus(token);
          setHasPremium(isPremium);
          setUserAuthenticated(true);
          setIsAuthenticating(false);
        } else if (isAuthenticated()) {
          const token = getAccessToken();
          accessTokenRef.current = token;
          
          // Check premium status
          const isPremium = await checkPremiumStatus(token);
          setHasPremium(isPremium);
          setUserAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err.message);
        setIsAuthenticating(false);
      } finally {
        setIsInitializing(false);
      }
    }
    
    handleAuthCallback();
  }, []);

  // Initialize Spotify Player
  useEffect(() => {
    if (!userAuthenticated || !hasPremium || !accessTokenRef.current) {
      return;
    }

    // Load Spotify SDK dynamically
    const loadSpotifySDK = () => {
      return new Promise((resolve) => {
        // Check if already loaded
        if (window.Spotify) {
          resolve();
          return;
        }

        // Check if script is already being loaded
        if (document.getElementById('spotify-sdk-script')) {
          window.onSpotifyWebPlaybackSDKReady = resolve;
          return;
        }

        // Set up callback before loading script
        window.onSpotifyWebPlaybackSDKReady = resolve;

        // Create and append script
        const script = document.createElement('script');
        script.id = 'spotify-sdk-script';
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);
      });
    };

    loadSpotifySDK().then(() => {
      initializePlayer();
    });

    function initializePlayer() {
      const player = new window.Spotify.Player({
        name: 'Spotify Brain Player',
        getOAuthToken: cb => {
          const token = getAccessToken();
          if (token) {
            accessTokenRef.current = token;
            cb(token);
          } else {
            setError('Token expired. Please log in again.');
            setUserAuthenticated(false);
          }
        },
        volume: 0.5
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => {
        console.error('Initialization error:', message);
        setError(`Initialization error: ${message}`);
      });

      player.addListener('authentication_error', ({ message }) => {
        console.error('Authentication error:', message);
        setError(`Authentication error: ${message}`);
        clearTokens();
        setUserAuthenticated(false);
      });

      player.addListener('account_error', ({ message }) => {
        console.error('Account error:', message);
        setError(`Account error: ${message}. Premium account required.`);
        setHasPremium(false);
      });

      player.addListener('playback_error', ({ message }) => {
        console.error('Playback error:', message);
        setError(`Playback error: ${message}`);
      });

      // Playback status updates
      player.addListener('player_state_changed', state => {
        if (!state) {
          setIsPlaying(false);
          setCurrentTrack(null);
          return;
        }

        setIsPlaying(!state.paused);
        
        if (state.track_window?.current_track) {
          const track = state.track_window.current_track;
          setCurrentTrack({
            id: track.id,
            name: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            albumArt: track.album.images[0]?.url,
            duration: track.duration_ms,
            position: state.position
          });
        }
      });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Spotify Player ready with device ID:', device_id);
        setDeviceId(device_id);
        setIsReady(true);
        setError(null);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline:', device_id);
        setIsReady(false);
      });

      // Connect to the player
      player.connect().then(success => {
        if (success) {
          console.log('Spotify Player connected successfully');
        } else {
          setError('Failed to connect to Spotify Player');
        }
      });

      playerRef.current = player;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
        playerRef.current = null;
      }
    };
  }, [userAuthenticated, hasPremium]);

  // Play a track
  const playTrack = useCallback(async (trackId) => {
    if (!deviceId || !accessTokenRef.current) {
      setError('Player not ready. Please wait or refresh the page.');
      return;
    }

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessTokenRef.current}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: [`spotify:track:${trackId}`]
        }),
      });

      if (!response.ok && response.status !== 204) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to play track');
      }
    } catch (err) {
      console.error('Play error:', err);
      setError(err.message);
    }
  }, [deviceId]);

  // Pause playback
  const pause = useCallback(async () => {
    if (playerRef.current) {
      await playerRef.current.pause();
    }
  }, []);

  // Resume playback
  const resume = useCallback(async () => {
    if (playerRef.current) {
      await playerRef.current.resume();
    }
  }, []);

  // Toggle playback
  const togglePlay = useCallback(async () => {
    if (playerRef.current) {
      await playerRef.current.togglePlay();
    }
  }, []);

  // Set volume (0-1)
  const setVolume = useCallback(async (volume) => {
    if (playerRef.current) {
      await playerRef.current.setVolume(volume);
    }
  }, []);

  // Login handler
  const login = useCallback(() => {
    initiateSpotifyLogin();
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.disconnect();
      playerRef.current = null;
    }
    clearTokens();
    setUserAuthenticated(false);
    setHasPremium(false);
    setIsReady(false);
    setCurrentTrack(null);
    setDeviceId(null);
  }, []);

  const value = {
    // State
    isReady,
    isPlaying,
    currentTrack,
    deviceId,
    error,
    isAuthenticated: userAuthenticated,
    hasPremium,
    isAuthenticating,
    isInitializing,
    
    // Actions
    playTrack,
    pause,
    resume,
    togglePlay,
    setVolume,
    login,
    logout,
    clearError: () => setError(null)
  };

  return (
    <SpotifyPlayerContext.Provider value={value}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
}

export default SpotifyPlayerContext;

