import React, { useEffect, useMemo, useState } from 'react';
import { Activity, CheckCircle2, Circle } from 'lucide-react';
import { DEFAULT_JOG_DISTANCE_KM, getJogPostWorkoutPlan } from '../data/jogData';

const JOG_SESSION_STORAGE_KEY = 'gympal_jog_session';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const createDefaultSession = (dateString) => ({
  date: dateString,
  distanceKm: DEFAULT_JOG_DISTANCE_KM,
  progress: [],
});

const loadJogSession = () => {
  const todayStr = getTodayDateString();

  try {
    const stored = localStorage.getItem(JOG_SESSION_STORAGE_KEY);
    if (!stored) return createDefaultSession(todayStr);

    const parsed = JSON.parse(stored);
    if (parsed.date !== todayStr) return createDefaultSession(todayStr);

    return {
      date: parsed.date,
      distanceKm: Number.isFinite(parsed.distanceKm) ? parsed.distanceKm : DEFAULT_JOG_DISTANCE_KM,
      progress: Array.isArray(parsed.progress) ? parsed.progress : [],
    };
  } catch {
    return createDefaultSession(todayStr);
  }
};

const normalizeDistance = (distance) => {
  if (!Number.isFinite(distance)) return DEFAULT_JOG_DISTANCE_KM;
  const clamped = Math.min(42, Math.max(0, distance));
  return Math.round(clamped * 10) / 10;
};

const JogWorkoutTab = ({ isTodayCompleted, onCompleteJog }) => {
  const [session, setSession] = useState(loadJogSession);
  const [distanceInput, setDistanceInput] = useState(() => String(session.distanceKm));

  const postJogPlan = useMemo(() => getJogPostWorkoutPlan(session.distanceKm), [session.distanceKm]);

  useEffect(() => {
    localStorage.setItem(JOG_SESSION_STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const updateDistance = (nextDistance) => {
    const normalizedDistance = normalizeDistance(nextDistance);
    setDistanceInput(String(normalizedDistance));

    setSession((prev) => {
      const currentPlan = getJogPostWorkoutPlan(prev.distanceKm);
      const nextPlan = getJogPostWorkoutPlan(normalizedDistance);
      const samePlanTier = currentPlan?.id === nextPlan?.id;
      const boundedProgress = samePlanTier
        ? prev.progress.filter((index) => index >= 0 && index < (nextPlan?.postWorkout.length || 0))
        : [];

      return {
        ...prev,
        distanceKm: normalizedDistance,
        progress: boundedProgress,
      };
    });
  };

  const commitDistanceInput = () => {
    const parsedDistance = Number.parseFloat(distanceInput);
    if (Number.isNaN(parsedDistance)) {
      setDistanceInput(String(session.distanceKm));
      return;
    }

    updateDistance(parsedDistance);
  };

  const togglePostWorkoutExercise = (index) => {
    if (isTodayCompleted) return;

    setSession((prev) => {
      const isChecked = prev.progress.includes(index);
      const nextProgress = isChecked
        ? prev.progress.filter((item) => item !== index)
        : [...prev.progress, index];

      return {
        ...prev,
        progress: nextProgress,
      };
    });
  };

  const totalExercises = postJogPlan?.postWorkout.length || 0;
  const allPostWorkoutChecked = totalExercises > 0 && session.progress.length === totalExercises;

  return (
    <section aria-label="Jog session builder" className="max-w-xl mx-auto">
      <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity size={20} className="text-emerald-400" />
              Jog + Post Workout
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              Either do your normal workout, or log your jog distance here and follow this post-jog plan.
            </p>
          </div>
          {isTodayCompleted && (
            <span className="text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              Session done today
            </span>
          )}
        </div>

        <div className="mt-6">
          <label htmlFor="jog-distance" className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
            Jog Distance (km)
          </label>
          <div className="mt-2 flex gap-3">
            <input
              id="jog-distance"
              type="number"
              inputMode="decimal"
              min="0"
              max="42"
              step="0.1"
              value={distanceInput}
              onChange={(event) => setDistanceInput(event.target.value)}
              onBlur={commitDistanceInput}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  commitDistanceInput();
                }
              }}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
              aria-describedby="jog-plan-help"
            />
          </div>
          <p id="jog-plan-help" className="mt-2 text-xs text-zinc-500">
            Tip: 0-2.9km = Recovery, 3-5.9km = Builder, 6km+ = Long-Run Armor.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {[2, 4, 7].map((distance) => (
              <button
                key={distance}
                type="button"
                onClick={() => updateDistance(distance)}
                className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors"
              >
                {distance} km preset
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="mb-4">
          <h4 className="text-lg font-bold text-white">{postJogPlan.title}</h4>
          <p className="text-sm text-zinc-400 mt-1">{postJogPlan.description}</p>
          <span className="inline-block mt-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-300">
            {postJogPlan.intensity} Intensity
          </span>
        </div>

        <div className="space-y-2">
          {postJogPlan.postWorkout.map((exercise, index) => {
            const isChecked = session.progress.includes(index) || isTodayCompleted;

            return (
              <button
                key={exercise}
                type="button"
                onClick={() => togglePostWorkoutExercise(index)}
                className={`w-full text-left p-3 rounded-xl border transition-colors flex items-center gap-3 ${
                  isChecked
                    ? 'border-emerald-900/50 bg-emerald-950/20 text-zinc-400'
                    : 'border-zinc-800 bg-zinc-950/40 text-zinc-100 hover:bg-zinc-800/60'
                }`}
                aria-pressed={isChecked}
                disabled={isTodayCompleted}
              >
                {isChecked ? (
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                ) : (
                  <Circle size={18} className="text-zinc-600 shrink-0" />
                )}
                <span className={isChecked ? 'line-through' : ''}>{exercise}</span>
              </button>
            );
          })}
        </div>

        {!isTodayCompleted && (
          <button
            type="button"
            onClick={() => onCompleteJog(session.distanceKm)}
            disabled={!allPostWorkoutChecked}
            className={`w-full mt-5 rounded-xl py-3 font-bold transition-all ${
              allPostWorkoutChecked
                ? 'bg-gradient-to-r from-emerald-600 to-blue-500 text-black hover:brightness-110'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {allPostWorkoutChecked ? 'Complete Jog Session' : 'Finish all post-jog exercises'}
          </button>
        )}
      </div>
    </section>
  );
};

export default JogWorkoutTab;
