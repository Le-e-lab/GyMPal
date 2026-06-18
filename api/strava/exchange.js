/**
 * POST /api/strava/exchange
 *
 * Exchanges a Strava OAuth authorization code for access + refresh tokens.
 * Uses the client secret from environment variables (never exposed to the client).
 */
export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body || {};

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Strava API not configured' });
  }

  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Strava token exchange failed:', data);
      return res.status(response.status).json({
        error: data.message || 'Token exchange failed',
      });
    }

    // Return tokens to the client (access_token, refresh_token, expires_at)
    return res.status(200).json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
      athlete: data.athlete
        ? { id: data.athlete.id, firstname: data.athlete.firstname, lastname: data.athlete.lastname }
        : null,
    });
  } catch (error) {
    console.error('Strava token exchange error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
