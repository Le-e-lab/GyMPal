import React, { useState, useEffect, useCallback } from 'react';
import { Activity, RefreshCw, MapPin, Clock, TrendingUp, Heart, Zap, Award } from 'lucide-react';
import { fetchActivities, getCachedActivities } from '../utils/stravaClient';

const SPORT_ICONS = {
  Run: '🏃',
  TrailRun: '🏃‍➡️',
  Ride: '🚴',
  VirtualRide: '🚴',
  Walk: '🚶',
  Hike: '🥾',
  Swim: '🏊',
  Workout: '🏋️',
  Yoga: '🧘',
  Other: '🎯',
};

const getSportIcon = (type, sportType) => {
  return SPORT_ICONS[sportType] || SPORT_ICONS[type] || SPORT_ICONS.Other;
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
};

const formatPace = (speedKmh) => {
  if (!speedKmh || speedKmh <= 0) return null;
  // Pace = minutes per km
  const paceMinPerKm = 60 / speedKmh;
  const min = Math.floor(paceMinPerKm);
  const sec = Math.round((paceMinPerKm - min) * 60);
  return `${min}:${sec.toString().padStart(2, '0')}/km`;
};

const StravaActivities = () => {
  const [activities, setActivities] = useState(() => getCachedActivities());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  const loadActivities = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);

    try {
      const data = await fetchActivities(1, 15);
      setActivities(data);
      setLastSync(new Date());
    } catch (err) {
      setError(err.message);
      // Fall back to cached data
      const cached = getCachedActivities();
      if (cached.length > 0) {
        setActivities(cached);
      }
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  // Load on mount (silent if we have cached data)
  useEffect(() => {
    if (activities.length === 0) {
      loadActivities(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter to show only recent runs and relevant activities
  const recentActivities = activities.slice(0, 20);

  const totalDistanceLast7 = activities
    .filter((a) => {
      const d = new Date(a.start_date);
      return Date.now() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
    })
    .reduce((sum, a) => sum + (a.type === 'Run' || a.sport_type === 'Run' ? a.distance_km : 0), 0);

  return (
    <div>
      {/* Sync header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity size={16} className="text-orange-400" />
            Recent Activities
          </h4>
          {lastSync && (
            <p className="text-[10px] text-zinc-500 mt-0.5">
              Synced {lastSync.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => loadActivities(true)}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-400 text-xs hover:text-white hover:border-zinc-500 transition-all active:scale-90 disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Sync
        </button>
      </div>

      {/* 7-day run distance summary */}
      {totalDistanceLast7 > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-orange-500/5 border border-orange-500/10">
          <p className="text-xs text-orange-300/80">
            <TrendingUp size={12} className="inline mr-1 -mt-0.5" />
            <span className="font-semibold text-orange-200">{totalDistanceLast7.toFixed(1)} km</span> run this week via Strava
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
          <p className="text-xs text-red-300/80">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && activities.length === 0 && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-zinc-800/50 animate-pulse" />
          ))}
        </div>
      )}

      {/* Activities list */}
      {recentActivities.length > 0 ? (
        <div className="space-y-2">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/30 border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors"
            >
              {/* Sport icon */}
              <span className="text-lg shrink-0">{getSportIcon(activity.type, activity.sport_type)}</span>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{activity.name}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <MapPin size={10} />
                    {activity.distance_km.toFixed(2)} km
                  </span>
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <Clock size={10} />
                    {activity.moving_time_minutes} min
                  </span>
                  {activity.average_heartrate && (
                    <span className="text-[10px] text-rose-400/70 flex items-center gap-1">
                      <Heart size={10} />
                      {Math.round(activity.average_heartrate)} bpm
                    </span>
                  )}
                  {formatPace(activity.average_speed_kmh) && activity.type === 'Run' && (
                    <span className="text-[10px] text-blue-400/70">{formatPace(activity.average_speed_kmh)}</span>
                  )}
                </div>
              </div>

              {/* Date badge */}
              <span className="shrink-0 text-[10px] text-zinc-500 font-medium bg-zinc-800/80 px-2 py-1 rounded-md">
                {formatDate(activity.start_date)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-8">
            <Activity size={24} className="mx-auto text-zinc-600 mb-2" />
            <p className="text-xs text-zinc-500">No activities yet. Go for a run and sync!</p>
          </div>
        )
      )}
    </div>
  );
};

export default StravaActivities;
