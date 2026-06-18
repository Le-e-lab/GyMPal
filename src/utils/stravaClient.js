/**
 * Strava OAuth + API client for GyMPal.
 *
 * This file handles:
 *  - OAuth authorization URL generation
 *  - Token exchange via Vercel serverless function
 *  - Token refresh via Vercel serverless function
 *  - Activity fetching via Vercel serverless function
 *  - Token persistence in localStorage
 */

const STORAGE_KEY = 'gympal_strava_tokens';
const ACTIVITIES_CACHE_KEY = 'gympal_strava_activities';

// Strava Client ID is public — safe to embed.
// The CLIENT SECRET stays server-side in Vercel environment variables.
const STRAVA_CLIENT_ID = 'YOUR_STRAVA_CLIENT_ID'; // ⚡ Replace with your Strava App Client ID

/**
 * Get the base URL for the app, used as the OAuth redirect_uri.
 * Detects localhost for dev and the actual domain in production.
 */
function getBaseUrl() {
  if (typeof window === 'undefined') return '';
  const { protocol, hostname, port } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
  }
  return `${protocol}//${hostname}`;
}

/**
 * Generate the Strava OAuth authorization URL.
 * User is redirected here to authorize GyMPal.
 */
export function getStravaAuthUrl() {
  const redirectUri = `${getBaseUrl()}/strava/callback`;
  const params = new URLSearchParams({
    client_id: STRAVA_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'read,activity:read_all',
  });
  return `https://www.strava.com/oauth/authorize?${params.toString()}`;
}

/**
 * Load stored Strava tokens from localStorage.
 */
export function getStoredTokens() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Save Strava tokens to localStorage.
 */
export function saveTokens(tokens) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  } catch (error) {
    console.warn('Failed to save Strava tokens:', error);
  }
}

/**
 * Clear stored Strava tokens (disconnect).
 */
export function clearTokens() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVITIES_CACHE_KEY);
  } catch (error) {
    console.warn('Failed to clear Strava tokens:', error);
  }
}

/**
 * Check if the current token is expired.
 * Tokens expire at `expires_at` (Unix timestamp).
 */
function isTokenExpired(expiresAt) {
  return Date.now() >= expiresAt * 1000;
}

/**
 * Exchange an authorization code for tokens via our serverless function.
 */
export async function exchangeCode(code) {
  const response = await fetch('/api/strava/exchange', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Token exchange failed');
  }

  const tokens = await response.json();
  saveTokens(tokens);
  return tokens;
}

/**
 * Refresh an expired access token via our serverless function.
 */
export async function refreshTokens(refreshToken) {
  const response = await fetch('/api/strava/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Token refresh failed');
  }

  const tokens = await response.json();
  // Preserve the athlete info from the original tokens
  const stored = getStoredTokens();
  saveTokens({ ...stored, ...tokens });
  return tokens;
}

/**
 * Get a valid access token, refreshing if necessary.
 * Returns null if no tokens are stored.
 */
export async function getValidAccessToken() {
  const tokens = getStoredTokens();
  if (!tokens) return null;

  // Refresh if expired (with 5-minute buffer)
  if (isTokenExpired(tokens.expires_at - 300)) {
    try {
      const refreshed = await refreshTokens(tokens.refresh_token);
      return refreshed.access_token;
    } catch (error) {
      console.warn('Failed to refresh Strava token:', error);
      clearTokens();
      return null;
    }
  }

  return tokens.access_token;
}

/**
 * Fetch recent activities from Strava via our serverless proxy.
 */
export async function fetchActivities(page = 1, perPage = 10) {
  const accessToken = await getValidAccessToken();
  if (!accessToken) throw new Error('Not connected to Strava');

  const response = await fetch(`/api/strava/activities?page=${page}&per_page=${perPage}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    clearTokens();
    throw new Error('Strava session expired. Please reconnect.');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch activities');
  }

  const data = await response.json();

  // Cache activities locally
  try {
    localStorage.setItem(ACTIVITIES_CACHE_KEY, JSON.stringify(data.activities));
  } catch {
    // Cache best-effort
  }

  return data.activities;
}

/**
 * Get cached activities (for offline / instant display).
 */
export function getCachedActivities() {
  try {
    const raw = localStorage.getItem(ACTIVITIES_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Check if the user has Strava connected (tokens exist).
 */
export function isStravaConnected() {
  return !!getStoredTokens();
}

/**
 * Get the connected athlete name from stored tokens.
 */
export function getAthleteName() {
  const tokens = getStoredTokens();
  if (!tokens?.athlete) return null;
  const { firstname, lastname } = tokens.athlete;
  return [firstname, lastname].filter(Boolean).join(' ');
}
