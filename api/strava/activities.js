/**
 * GET /api/strava/activities
 *
 * Proxies Strava athlete activities using the user's access token.
 * The token is sent from the client in the Authorization header.
 * We proxy through our server to avoid CORS issues and keep the token handling clean.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const accessToken = authHeader.slice(7);
  const page = req.query.page || 1;
  const perPage = Math.min(Number(req.query.per_page) || 10, 50);

  try {
    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 401) {
      return res.status(401).json({ error: 'Token expired', expired: true });
    }

    const data = await response.json();

    if (!response.ok) {
      console.error('Strava activities fetch failed:', data);
      return res.status(response.status).json({
        error: data.message || 'Failed to fetch activities',
      });
    }

    // Map to a clean format for our app
    const activities = data.map((activity) => ({
      id: activity.id,
      name: activity.name,
      type: activity.type,
      sport_type: activity.sport_type,
      distance_km: Math.round((activity.distance / 1000) * 100) / 100,
      moving_time_minutes: Math.round(activity.moving_time / 60),
      elapsed_time_minutes: Math.round(activity.elapsed_time / 60),
      total_elevation_gain: activity.total_elevation_gain,
      start_date: activity.start_date,
      average_speed_kmh: activity.average_speed
        ? Math.round(activity.average_speed * 3.6 * 100) / 100
        : null,
      average_heartrate: activity.average_heartrate,
      max_heartrate: activity.max_heartrate,
      suffer_score: activity.suffer_score,
      kudos_count: activity.kudos_count,
      achievement_count: activity.achievement_count,
    }));

    return res.status(200).json({ activities });
  } catch (error) {
    console.error('Strava activities fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
