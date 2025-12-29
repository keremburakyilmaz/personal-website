// Spotify OAuth Configuration
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI || `${window.location.origin}/spotify-brain`;

// Debug: Check if environment variables are loaded
console.log('Spotify Client ID loaded:', CLIENT_ID ? `${CLIENT_ID.substring(0, 8)}...` : 'NOT SET');
console.log('Redirect URI:', REDIRECT_URI);
const SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-recently-played'
].join(' ');

// Token storage keys
const TOKEN_KEY = 'spotify_access_token';
const TOKEN_EXPIRY_KEY = 'spotify_token_expiry';
const CODE_VERIFIER_KEY = 'spotify_code_verifier';

/**
 * Generate a random string for PKCE code verifier
 */
function generateCodeVerifier(length = 128) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map(x => possible[x % possible.length])
    .join('');
}

/**
 * Generate code challenge from verifier (SHA-256 hash, base64url encoded)
 */
async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Redirect user to Spotify authorization page
 */
export async function initiateSpotifyLogin() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  // Store code verifier for token exchange
  sessionStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);
  
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('client_id', CLIENT_ID);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('scope', SCOPES);
  authUrl.searchParams.append('code_challenge_method', 'S256');
  authUrl.searchParams.append('code_challenge', codeChallenge);
  
  window.location.href = authUrl.toString();
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code) {
  const codeVerifier = sessionStorage.getItem(CODE_VERIFIER_KEY);
  
  if (!codeVerifier) {
    throw new Error('Code verifier not found. Please restart the login process.');
  }
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_description || 'Failed to exchange code for token');
  }
  
  const data = await response.json();
  
  // Store tokens
  const expiryTime = Date.now() + (data.expires_in * 1000);
  sessionStorage.setItem(TOKEN_KEY, data.access_token);
  sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  
  // Clean up code verifier
  sessionStorage.removeItem(CODE_VERIFIER_KEY);
  
  return data.access_token;
}

/**
 * Get the stored access token if valid
 */
export function getAccessToken() {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
  
  if (!token || !expiry) {
    return null;
  }
  
  // Check if token is expired (with 5 minute buffer)
  if (Date.now() > parseInt(expiry) - 300000) {
    clearTokens();
    return null;
  }
  
  return token;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return getAccessToken() !== null;
}

/**
 * Clear stored tokens (logout)
 */
export function clearTokens() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
  sessionStorage.removeItem(CODE_VERIFIER_KEY);
}

/**
 * Handle OAuth callback - extract code from URL
 */
export function getAuthCodeFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const error = urlParams.get('error');
  
  if (error) {
    throw new Error(`Authorization failed: ${error}`);
  }
  
  return code;
}

/**
 * Clean up URL after OAuth callback
 */
export function cleanupAuthUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete('code');
  url.searchParams.delete('state');
  window.history.replaceState({}, document.title, url.pathname);
}

/**
 * Fetch user profile to check Premium status
 */
export async function fetchUserProfile(accessToken) {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  
  return response.json();
}

/**
 * Check if user has Premium subscription
 */
export async function checkPremiumStatus(accessToken) {
  try {
    const profile = await fetchUserProfile(accessToken);
    return profile.product === 'premium';
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
}

