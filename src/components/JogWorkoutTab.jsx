import React, { useEffect, useMemo, useState } from 'react';
import { Activity, CheckCircle2, Circle, ChevronDown, ChevronRight, Flame, Info, Sparkles, Zap, Dumbbell, Heart, Wind } from 'lucide-react';
import { DEFAULT_JOG_DISTANCE_KM, getJogPostWorkoutPlan, ON_THE_MOVE_EXERCISES, FAT_LOSS_TIPS } from '../data/jogData';
import { getWorkoutForDay } from '../data/workoutData';
import { safeLocalStorage, toDateKey } from '../utils/storage';

const JOG_SESSION_STORAGE_KEY = 'gympal_jog_session';

const getTodayDateString = () => toDateKey(new Date());

const createDefaultSession = (dateString) => ({
  date: dateString,
  distanceKm: DEFAULT_JOG_DISTANCE_KM,
  progress: [],
});

const loadJogSession = () => {
  const todayStr = getTodayDateString();

  const stored = safeLocalStorage.getJSON(
    JOG_SESSION_STORAGE_KEY,
    null,
    (value) => value && typeof value === 'object',
    (error) => console.warn('LocalStorage error', error)
  );

  if (!stored) return createDefaultSession(todayStr);

  if (stored.date !== todayStr) return createDefaultSession(todayStr);

  return {
    date: stored.date,
    distanceKm: Number.isFinite(stored.distanceKm) ? stored.distanceKm : DEFAULT_JOG_DISTANCE_KM,
    progress: Array.isArray(stored.progress) ? stored.progress : [],
  };
};

const normalizeDistance = (distance) => {
  if (!Number.isFinite(distance)) return DEFAULT_JOG_DISTANCE_KM;
  const clamped = Math.min(42, Math.max(0, distance));
  return Math.round(clamped * 10) / 10;
};

const JogWorkoutTab = ({ isTodayCompleted, onCompleteJog, currentDay }) => {
  const [session, setSession] = useState(loadJogSession);
  const [distanceInput, setDistanceInput] = useState(() => String(session.distanceKm));
  const [showFatLoss, setShowFatLoss] = useState(false);
  const [showOnTheMove, setShowOnTheMove] = useState(true);

  const todayWorkout = useMemo(() => currentDay ? getWorkoutForDay(currentDay) : null, [currentDay]);
  const isRunDay = todayWorkout?.type?.toLowerCase().includes('run day');
  const runPlan = isRunDay ? todayWorkout?.routine?.[0] : null;

  const postJogPlan = useMemo(() => getJogPostWorkoutPlan(session.distanceKm), [session.distanceKm]);

  useEffect(() => {
    safeLocalStorage.setJSON(
      JOG_SESSION_STORAGE_KEY,
      session,
      (error) => console.warn('LocalStorage error', error)
    );
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

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <section aria-label="Run coach" className="max-w-xl mx-auto space-y-5">

      {/* ── Run Day Banner ── */}
      {isRunDay ? (
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Activity size={20} className="text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                Run Day — {dayNames[new Date().getDay()]}
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/70 bg-amber-500/10 px-2 py-0.5 rounded-full">Planned</span>
              </h3>
              <p className="text-sm text-amber-200/80 mt-1 leading-relaxed">{runPlan}</p>
              <p className="text-xs text-amber-400/60 mt-1">
                {todayWorkout?.routine?.[1] || 'Follow with mobility'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center">
              <Activity size={18} className="text-zinc-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-300">Rest Day — Optional Jog</p>
              <p className="text-xs text-zinc-500">No run planned today. If you do jog, log it below.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── On-The-Move Exercises (Run Day Only) ── */}
      {isRunDay && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowOnTheMove(!showOnTheMove)}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-amber-400" />
              <h3 className="text-sm font-bold text-white">On-The-Move Drills</h3>
              <span className="text-[10px] text-zinc-500 font-medium bg-zinc-800 px-2 py-0.5 rounded-full">
                {ON_THE_MOVE_EXERCISES.length}
              </span>
            </div>
            {showOnTheMove ? <ChevronDown size={16} className="text-zinc-500" /> : <ChevronRight size={16} className="text-zinc-500" />}
          </button>

          {showOnTheMove && (
            <div className="px-4 pb-4 space-y-2">
              <p className="text-xs text-zinc-500 mb-2">
                Sprinkle these into your run without stopping. Each engages different muscles and keeps fat-burn elevated.
              </p>
              {ON_THE_MOVE_EXERCISES.map((exercise) => (
                <div key={exercise.id} className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{exercise.name}</span>
                        <span className="text-[10px] font-medium text-zinc-500 bg-zinc-800/60 px-1.5 py-0.5 rounded">{exercise.duration}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">{exercise.description}</p>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-start gap-1.5">
                    <Flame size={11} className="text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-orange-400/70 leading-relaxed">{exercise.fatLossTip}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Distance Input + Post-Workout Plan (always visible) ── */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Dumbbell size={18} className="text-emerald-400" />
              Log Your Run
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Set your distance, then complete the post-run exercises.
            </p>
          </div>
          {isTodayCompleted && (
            <span className="text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 whitespace-nowrap">
              Done today
            </span>
          )}
        </div>

        <div className="mt-5">
          <label htmlFor="jog-distance" className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
            Distance (km)
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
                className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors active:scale-95"
              >
                {distance} km
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Post-Workout Plan ── */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
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
                className={`w-full text-left p-3 rounded-xl border transition-colors flex items-center gap-3 active:scale-[0.99] ${
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
            className={`w-full mt-5 rounded-xl py-3 font-bold transition-all active:scale-[0.97] ${
              allPostWorkoutChecked
                ? 'bg-gradient-to-r from-emerald-600 to-blue-500 text-black hover:brightness-110'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {allPostWorkoutChecked ? 'Complete Jog Session' : 'Finish all post-jog exercises'}
          </button>
        )}
      </div>

      {/* ── Fat Loss & Natural Remedies ── */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowFatLoss(!showFatLoss)}
          className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-rose-400" />
            <h3 className="text-sm font-bold text-white">Fat Loss & Natural Science</h3>
          </div>
          {showFatLoss ? <ChevronDown size={16} className="text-zinc-500" /> : <ChevronRight size={16} className="text-zinc-500" />}
        </button>

        {showFatLoss && (
          <div className="px-4 pb-4 space-y-3">
            <p className="text-xs text-zinc-500">
              Evidence-backed insights to optimize your run for fat loss, backed by clinical research.
            </p>
            {FAT_LOSS_TIPS.map((tip, index) => (
              <div key={index} className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                <div className="flex items-start gap-2">
                  <Sparkles size={14} className="text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-white">{tip.title}</p>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{tip.body}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <Info size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300/80 leading-relaxed">
                  <strong className="text-amber-200">Reminder:</strong> Supplements support — they don't replace — consistent training and nutrition. Always consult a professional before starting new supplements.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

    </section>
  );
};

export default JogWorkoutTab;
