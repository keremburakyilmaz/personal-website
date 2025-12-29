import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell } from 'recharts';
import './SpotifyBrain.css';
import dashboardData from '../../assets/dashboard_data.json';
import { useSpotifyPlayer } from '../../contexts/SpotifyPlayerContext';

export default function SpotifyBrain() {
  const [data, setData] = useState(null);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [playingTrackId, setPlayingTrackId] = useState(null);
  
  const {
    isReady,
    isPlaying,
    currentTrack,
    isAuthenticated,
    hasPremium,
    isAuthenticating,
    isInitializing,
    error,
    playTrack,
    togglePlay,
    login,
    logout,
    clearError
  } = useSpotifyPlayer();

  useEffect(() => {
    setData(dashboardData);
  }, []);

  // Update playing track ID based on current track from player
  useEffect(() => {
    if (currentTrack && isPlaying) {
      setPlayingTrackId(currentTrack.id);
    } else if (!isPlaying) {
      setPlayingTrackId(null);
    }
  }, [currentTrack, isPlaying]);

  // Handle play button click
  const handlePlayClick = async (trackId) => {
    if (!isReady) return;
    
    if (playingTrackId === trackId && isPlaying) {
      // If same track is playing, pause it
      await togglePlay();
    } else {
      // Play new track
      await playTrack(trackId);
      setPlayingTrackId(trackId);
    }
  };

  // Update current hour periodically to keep the highlight accurate
  useEffect(() => {
    const updateHour = () => {
      setCurrentHour(new Date().getHours());
    };
    
    // Update immediately and then every minute
    updateHour();
    const interval = setInterval(updateHour, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <section className="spotify-brain-section">
        <div className="loading-container">
          <p>Loading dashboard data...</p>
        </div>
      </section>
    );
  }

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Format timestamp for recently played cards (e.g., "02:36 PM")
  const formatTimestampShort = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Helper function to safely handle NaN/null/undefined values
  const safeNumber = (value, defaultValue = 0) => {
    if (value === null || value === undefined) {
      return defaultValue;
    }
    // Handle string "NaN" or actual NaN
    if (value === "NaN" || (typeof value === 'number' && isNaN(value))) {
      return defaultValue;
    }
    // Convert string numbers to numbers
    if (typeof value === 'string' && value !== "NaN") {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
    return value;
  };

  // Helper function to safely format numbers with fallback
  const safeToFixed = (value, decimals = 1, fallback = 'N/A') => {
    const num = safeNumber(value);
    if (num === 0 && value !== 0 && (value === null || value === undefined || isNaN(value))) {
      return fallback;
    }
    return num.toFixed(decimals);
  };

  // Prepare session probabilities data
  const sessionProbsData = Object.entries(data.session_probs || {}).map(([hour, prob]) => ({
    hour: parseInt(hour),
    hourLabel: `${parseInt(hour) % 12 || 12}${parseInt(hour) >= 12 ? 'PM' : 'AM'}`,
    probability: safeNumber(prob, 0),
    isCurrentHour: parseInt(hour) === currentHour
  }));

  // Prepare mood trajectory data
  const moodTrajectoryData = data.mood_trajectory && Array.isArray(data.mood_trajectory) 
    ? data.mood_trajectory
        .filter(item => item && item.time && !isNaN(item.valence) && !isNaN(item.energy))
        .map(item => ({
    time: new Date(item.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    timestamp: new Date(item.time).getTime(),
          valence: safeNumber(item.valence),
          energy: safeNumber(item.energy)
        }))
    : [];

  // Prepare cluster radar data
  const getClusterRadarData = (cluster) => {
    const centroid = cluster.centroid || {};
    return [
      { feature: 'Valence', value: safeNumber(centroid.valence, 0) * 100 },
      { feature: 'Energy', value: safeNumber(centroid.energy, 0) * 100 },
      { feature: 'Dance', value: safeNumber(centroid.danceability, 0) * 100 },
      { feature: 'Acoustic', value: safeNumber(centroid.acousticness, 0) * 100 },
      { feature: 'Instrumental', value: safeNumber(centroid.instrumentalness, 0) * 100 },
      { feature: 'Tempo', value: safeNumber(centroid.tempo_norm, 0) * 100 }
    ];
  };

  // Get confidence color
  const getConfidenceColor = (confidence) => {
    const conf = safeNumber(confidence, 0);
    if (conf >= 0.8) return '#10b981'; // Green
    if (conf >= 0.5) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  // Get mood color based on cluster - supports 3-15 clusters with muted colors
  const getMoodColor = (clusterId, totalClusters) => {
    // Predefined palette of 15 muted colors - well-spaced hues for easy distinction
    const mutedPalette = [
      '#c49d7f', // Muted terracotta/orange
      '#7fc49d', // Muted green
      '#7f9dc4', // Muted blue
      '#c47f9d', // Muted pink/magenta
      '#9d7fc4', // Muted purple
      '#7fc4a6', // Muted teal/cyan
      '#c4a67f', // Muted yellow/amber
      '#9dc47f', // Muted lime
      '#7fa6c4', // Muted sky blue
      '#c47f7f', // Muted red/coral
      '#7fc47f', // Muted emerald
      '#a67fc4', // Muted violet
      '#7fc4c4', // Muted aqua
      '#c4c47f', // Muted chartreuse
      '#c49d9d'  // Muted rose
    ];
    
    // Use modulo to cycle through palette if clusterId exceeds palette size
    return mutedPalette[clusterId % mutedPalette.length];
  };

  const nextPrediction = data.next_prediction || {};
  const confidencePercent = safeToFixed(safeNumber(nextPrediction.confidence, 0) * 100, 1, '0.0');
  const totalClusters = (data.mood_clusters && data.mood_clusters.length) || 0;

  return (
    <section className="spotify-brain-section">
      <div className="spotify-brain-header">
        <h1>My Spotify Brain</h1>
        <p className="last-updated">
          Last updated: {new Date(data.generated_at).toLocaleString()}
        </p>
      </div>

      {/* Spotify Player Authentication Bar */}
      <div className="spotify-player-bar">
        {isInitializing ? (
          <div className="player-status">
            <div className="loading-spinner"></div>
            <span>Initializing player...</span>
          </div>
        ) : isAuthenticating ? (
          <div className="player-status">
            <div className="loading-spinner"></div>
            <span>Authenticating with Spotify...</span>
          </div>
        ) : !isAuthenticated ? (
          <div className="login-prompt">
            <div className="login-prompt-content">
              <svg className="spotify-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <span>Connect with Spotify to play tracks</span>
              <button className="spotify-login-button" onClick={login}>
                <span>Login with Spotify</span>
              </button>
            </div>
            <p className="premium-note">Requires Spotify Premium</p>
          </div>
        ) : !hasPremium ? (
          <div className="premium-required">
            <svg className="warning-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>Spotify Premium is required for playback</span>
            <button className="spotify-logout-button" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="player-connected">
            <div className="player-status-indicator">
              <span className={`status-dot ${isReady ? 'ready' : 'connecting'}`}></span>
              <span>{isReady ? 'Player Ready' : 'Connecting...'}</span>
            </div>
            {currentTrack && (
              <div className="now-playing-info">
                <span className="now-playing-label">Now Playing:</span>
                <span className="now-playing-track">{currentTrack.name} - {currentTrack.artist}</span>
              </div>
            )}
            <button className="spotify-logout-button" onClick={logout}>
              Logout
            </button>
          </div>
        )}
        {error && (
          <div className="player-error">
            <span>{error}</span>
            <button className="error-dismiss" onClick={clearError}>×</button>
          </div>
        )}
      </div>

      <div className="dashboard-layout">
        {/* 2xn Grid */}
        <div className="dashboard-grid">
          {/* Recently Played Stream - Horizontal Cards */}
          <div className="recently-played-stream-card">
            <div className="recently-played-stream-header">
              <h2>Recently Played</h2>
              <button className="refresh-button" aria-label="Refresh">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
              </button>
            </div>
            <div className="recently-played-stream">
              {(data.recently_played || []).slice(0, 20).map((track, index) => {
                const moodLabel = (data.mood_clusters || []).find(c => c.cluster_id === track.mood_cluster_id)?.label || `Cluster ${track.mood_cluster_id}`;
                const moodColor = getMoodColor(safeNumber(track.mood_cluster_id, 0), totalClusters);
                
                const isCurrentlyPlaying = playingTrackId === track.track_id && isPlaying;
                
                return (
                  <div key={`${track.track_id}-${index}`} className={`recently-played-card-item ${isCurrentlyPlaying ? 'now-playing' : ''}`}>
                    <div className="card-album-art">
                      <img 
                        src={track.image_url} 
                        alt={`${track.track_name} by ${track.artist_name}`}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                        }}
                      />
                      {isReady && track.track_id && (
                        <button 
                          className={`play-button-overlay ${isCurrentlyPlaying ? 'playing' : ''}`}
                          onClick={() => handlePlayClick(track.track_id)}
                          aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
                        >
                          {isCurrentlyPlaying ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <rect x="6" y="4" width="4" height="16" rx="1" />
                              <rect x="14" y="4" width="4" height="16" rx="1" />
                            </svg>
                          ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="5,3 19,12 5,21" />
                            </svg>
                          )}
                        </button>
                      )}
                      {track.mood_cluster_id !== undefined && (
                        <div className="card-mood-tag" style={{ backgroundColor: moodColor }}>
                          {moodLabel}
                        </div>
                      )}
                    </div>
                    <div className="card-info">
                      <div className="card-song-title">{track.track_name}</div>
                      <div className="card-artist">{track.artist_name}</div>
                      <div className="card-timestamp" title={formatTimestamp(track.played_at)}>
                        {formatTimestampShort(track.played_at)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Next Track Mood Prediction Card */}
          <div className="mood-prediction-card" style={{ borderColor: getMoodColor(nextPrediction.mood_cluster_id, totalClusters) }}>
            <h2>Next Track Mood Prediction</h2>
            <div className="mood-label" style={{ color: getMoodColor(nextPrediction.mood_cluster_id, totalClusters) }}>
              {nextPrediction.mood_label}
            </div>
            <div className="confidence-section">
              <div className="confidence-label">Confidence</div>
              <div className="confidence-bar-container">
                <div 
                  className="confidence-bar" 
                  style={{ 
                    width: `${confidencePercent}%`,
                    backgroundColor: getConfidenceColor(nextPrediction.confidence)
                  }}
                />
              </div>
              <div className="confidence-value" style={{ color: getConfidenceColor(nextPrediction.confidence) }}>
                {confidencePercent}%
              </div>
            </div>
            {nextPrediction.genre_family && (
              <div className="genre-family">
                <span className="genre-label">Genre:</span> {nextPrediction.genre_family}
              </div>
            )}
            {nextPrediction.recommended_tracks && nextPrediction.recommended_tracks.length > 0 && (
              <div className="recommended-tracks-section">
                <h3 className="recommended-tracks-title">Recommended Tracks</h3>
                <div className="recommended-tracks-grid">
                  {nextPrediction.recommended_tracks.slice(0, 3).map((track, index) => {
                    const isTrackPlaying = playingTrackId === track.track_id && isPlaying;
                    return (
                      <div key={track.track_id || index} className={`recommended-track-card ${isTrackPlaying ? 'now-playing' : ''}`}>
                        <div className="recommended-track-image-container">
                          <img 
                            src={track.image_url} 
                            alt={`${track.track_name} by ${track.artist_name}`}
                            className="recommended-track-image"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                            }}
                          />
                          {isReady && track.track_id && (
                            <button 
                              className={`play-button-overlay small ${isTrackPlaying ? 'playing' : ''}`}
                              onClick={() => handlePlayClick(track.track_id)}
                              aria-label={isTrackPlaying ? 'Pause' : 'Play'}
                            >
                              {isTrackPlaying ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                  <rect x="6" y="4" width="4" height="16" rx="1" />
                                  <rect x="14" y="4" width="4" height="16" rx="1" />
                                </svg>
                              ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                  <polygon points="5,3 19,12 5,21" />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                        <div className="recommended-track-info">
                          <div className="recommended-track-name">{track.track_name}</div>
                          <div className="recommended-track-artist">{track.artist_name}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Hourly Session Start Probability Chart */}
          <div className="session-prob-card">
            <h2>Hourly Session Start Probability</h2>
            {data.top_hours && data.top_hours.length > 0 && (
              <div className="top-hours-info">
                <p className="top-hours-label">Top Hours:</p>
                <div className="top-hours-list">
                  {data.top_hours.slice(0, 3).map((item, idx) => (
                    <span key={idx} className="top-hour-badge">
                      {item.hour % 12 || 12}{item.hour >= 12 ? 'PM' : 'AM'} ({safeToFixed(item.probability * 100, 1)}%)
                    </span>
                  ))}
                </div>
              </div>
            )}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sessionProbsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.2)" />
                <XAxis 
                  dataKey="hourLabel" 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  label={{ value: 'Probability', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                  cursor={{ stroke: 'rgba(148, 163, 184, 0.2)', strokeWidth: 1, opacity: 0.15 }}
                  formatter={(value) => [safeToFixed(safeNumber(value, 0) * 100, 1) + '%', 'Probability']}
                />
                <Bar 
                  dataKey="probability" 
                  fill="url(#sessionGradient)"
                  radius={[8, 8, 0, 0]}
                >
                  {sessionProbsData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.isCurrentHour ? '#6366f1' : 'url(#sessionGradient)'}
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Mood Trajectory Visualization */}
          <div className="mood-trajectory-card">
            <h2>Mood Trajectory (Last 24 Hours)</h2>
            {moodTrajectoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodTrajectoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.2)" />
                <XAxis 
                  dataKey="time" 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#10b981"
                  tick={{ fill: '#10b981', fontSize: 12 }}
                  label={{ value: 'Valence', angle: -90, position: 'insideLeft', fill: '#10b981' }}
                  domain={[0, 1]}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#f59e0b"
                  tick={{ fill: '#f59e0b', fontSize: 12 }}
                  label={{ value: 'Energy', angle: 90, position: 'insideRight', fill: '#f59e0b' }}
                  domain={[0, 1]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="valence" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Valence"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="energy" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 4 }}
                  name="Energy"
                />
              </LineChart>
            </ResponsiveContainer>
            ) : (
              <div className="no-data-message">
                <p>No mood trajectory data available</p>
              </div>
            )}
          </div>

          {/* Mood Clusters Overview */}
          <div className="mood-clusters-card">
            <h2>Mood Clusters Overview</h2>
            <div className="clusters-grid">
              {(data.mood_clusters || []).map((cluster) => {
                const radarData = getClusterRadarData(cluster);
                const clusterColor = getMoodColor(cluster.cluster_id, totalClusters);
                
                return (
                  <div key={cluster.cluster_id} className="cluster-card" style={{ borderColor: clusterColor }}>
                    <div className="cluster-header">
                      <h3 style={{ color: clusterColor }}>{cluster.label}</h3>
                      <span className="cluster-id-badge" style={{ backgroundColor: clusterColor }}>
                        Cluster {cluster.cluster_id}
                      </span>
                    </div>
                    <div className="cluster-radar">
                      <ResponsiveContainer width="100%" height={200}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="rgba(99, 102, 241, 0.2)" />
                          <PolarAngleAxis 
                            dataKey="feature" 
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                          />
                          <PolarRadiusAxis 
                            angle={90} 
                            domain={[0, 100]}
                            tick={{ fill: '#94a3b8', fontSize: 10 }}
                          />
                          <Radar
                            name="Features"
                            dataKey="value"
                            stroke={clusterColor}
                            fill={clusterColor}
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(15, 23, 42, 0.95)',
                              border: `1px solid ${clusterColor}`,
                              borderRadius: '8px',
                              color: '#f1f5f9'
                            }}
                            formatter={(value) => [safeToFixed(safeNumber(value, 0), 1) + '%', 'Value']}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="cluster-features">
                      <div className="feature-list">
                        <div className="feature-item">
                          <span className="feature-name">Valence:</span>
                          <span className="feature-value">{safeToFixed(safeNumber(cluster.centroid?.valence, 0) * 100, 1)}%</span>
                        </div>
                        <div className="feature-item">
                          <span className="feature-name">Energy:</span>
                          <span className="feature-value">{safeToFixed(safeNumber(cluster.centroid?.energy, 0) * 100, 1)}%</span>
                        </div>
                        <div className="feature-item">
                          <span className="feature-name">Danceability:</span>
                          <span className="feature-value">{safeToFixed(safeNumber(cluster.centroid?.danceability, 0) * 100, 1)}%</span>
                        </div>
                        <div className="feature-item">
                          <span className="feature-name">Acousticness:</span>
                          <span className="feature-value">{safeToFixed(safeNumber(cluster.centroid?.acousticness, 0) * 100, 1)}%</span>
                        </div>
                        <div className="feature-item">
                          <span className="feature-name">Instrumentalness:</span>
                          <span className="feature-value">{safeToFixed(safeNumber(cluster.centroid?.instrumentalness, 0) * 100, 1)}%</span>
                        </div>
                        <div className="feature-item">
                          <span className="feature-name">Tempo:</span>
                          <span className="feature-value">{safeToFixed(safeNumber(cluster.centroid?.tempo_norm, 0) * 100, 1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Performance Metrics */}
          <div className="metrics-card">
            <h2>Model Performance Metrics</h2>
            <div className="metrics-content">
              <div className="metrics-summary">
                <div className="metric-stat">
                  <span className="metric-label">Training Tracks:</span>
                  <span className="metric-value">{safeNumber(data.metrics?.latest?.num_tracks, 0)}</span>
                </div>
                <div className="metric-stat">
                  <span className="metric-label">Training Sessions:</span>
                  <span className="metric-value">{safeNumber(data.metrics?.latest?.num_sessions, 0)}</span>
                </div>
              </div>
              <div className="metrics-details">
                <div className="model-metrics">
                  <h3>Mood Model</h3>
                  <div className="metric-row">
                    <span className="metric-label">Training Accuracy:</span>
                    <span className="metric-value good">
                      {safeToFixed(safeNumber(data.metrics?.latest?.mood_model?.train_accuracy, 0) * 100, 1)}%
                    </span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Validation Accuracy:</span>
                    <span className="metric-value good">
                      {safeToFixed(safeNumber(data.metrics?.latest?.mood_model?.val_accuracy, 0) * 100, 1)}%
                    </span>
                  </div>
                </div>
                <div className="model-metrics">
                  <h3>Session Model</h3>
                  <div className="metric-row">
                    <span className="metric-label">Training ROC-AUC:</span>
                    <span className="metric-value good">
                      {safeToFixed(safeNumber(data.metrics?.latest?.session_model?.train_roc_auc, 0), 3)}
                    </span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Validation ROC-AUC:</span>
                    <span className="metric-value good">
                      {safeToFixed(safeNumber(data.metrics?.latest?.session_model?.val_roc_auc, 0), 3)}
                    </span>
                  </div>
                  {data.metrics?.latest?.session_model?.calibration_error !== undefined && (
                    <div className="metric-row">
                      <span className="metric-label">Calibration Error:</span>
                      <span className="metric-value">
                        {safeToFixed(safeNumber(data.metrics.latest.session_model.calibration_error, 0), 4)}
                      </span>
                    </div>
                  )}
                  {data.metrics?.latest?.session_model?.val_pr_auc !== undefined && (
                    <div className="metric-row">
                      <span className="metric-label">Validation PR-AUC:</span>
                      <span className="metric-value">
                        {safeToFixed(safeNumber(data.metrics.latest.session_model.val_pr_auc, 0), 3)}
                      </span>
                    </div>
                  )}
                  {data.metrics?.latest?.session_model?.val_f1 !== undefined && (
                    <div className="metric-row">
                      <span className="metric-label">Validation F1:</span>
                      <span className="metric-value">
                        {safeToFixed(safeNumber(data.metrics.latest.session_model.val_f1, 0), 3)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
