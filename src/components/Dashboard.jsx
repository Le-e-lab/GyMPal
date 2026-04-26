import React, { Suspense, lazy, useEffect, useState } from 'react';
import { getWorkoutForDay, getSnackPunishment, isWeekend } from '../data/workoutData';
import { getRandomQuote } from '../data/quotes';
import { useWorkout } from '../hooks/useWorkout';
import WorkoutCard from './WorkoutCard';
import JogWorkoutTab from './JogWorkoutTab';
import WeekendRecovery from './WeekendRecovery';
import AIWorkoutGeneratorPanel from './AIWorkoutGeneratorPanel';
import ShareExportPanel from './ShareExportPanel';
import { Trophy, Flame, Calendar, Activity, RefreshCw, AlertTriangle, CalendarPlus, Plus, Dumbbell, Utensils } from 'lucide-react';

const WeightChart = lazy(() => import('./WeightChart'));
const BMIProgressRing = lazy(() => import('./BMIProgressRing'));
const ProgressOverview = lazy(() => import('./ProgressOverview'));
const ExerciseLibraryPanel = lazy(() => import('./ExerciseLibraryPanel'));

const generateCalendarInvite = () => {
  // Create a repeating daily event starting tomorrow at 7:00 AM
  const now = new Date();
  
  // Set to 7 AM tomorrow
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 7, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 8, 0, 0);

  // Format date to ICS required format: YYYYMMDDTHHMMSSZ
  // ICS requires UTC time for standard compatibility
  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GyMPal//Daily Workout Rhythm//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTAMP:${formatDate(now)}`,
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    'RRULE:FREQ=DAILY', // This makes it repeat every day forever
    'SUMMARY:GyMPal Daily Workout',
    "DESCRIPTION:Time to hit your daily GyMPal requirements and keep the streak alive! Open the app to check today's mission.\\n\\nStay consistent!",
    'BEGIN:VALARM',
    'TRIGGER:-PT0M', // Alarm exactly at start time
    'ACTION:DISPLAY',
    'DESCRIPTION:GyMPal Reminder',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'gympal-daily-reminder.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const Dashboard = () => {
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [activeTab, setActiveTab] = useState('workout'); // 'workout', 'jog', or 'stats'
  const [customWorkoutForToday, setCustomWorkoutForToday] = useState(null);
  const weightInputId = 'weekly-weight-input';
  const { 
    currentDay, 
    streak, 
    history,
    isTodayCompleted, 
    dailyProgress,
    punishments,
    proteinStreak,
    weightLogs,
    jogLogs,
    markWorkoutComplete, 
    toggleExercise,
    addPunishment,
    logProteinGoal,
    addWeightLog,
    addJogLog,
    clearTodayProgress,
    resetProgress 
  } = useWorkout();
  
  const latestWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : null;

  const today = new Date();
  const isRestDay = isWeekend(today);

  const defaultWorkout = isRestDay ? null : getWorkoutForDay(currentDay);
  const currentWorkout = customWorkoutForToday?.day === currentDay
    ? customWorkoutForToday.workout
    : defaultWorkout;
  
  // Rotate quotes every 5 minutes (300,000 ms)
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [dailyQuote, setDailyQuote] = useState(() => getRandomQuote(currentWorkout?.intensity || 'Medium'));

  useEffect(() => {
    const interval = setInterval(() => {
      setDailyQuote(getRandomQuote(currentWorkout?.intensity || 'Medium'));
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [currentWorkout?.intensity]);

  useEffect(() => {
    if (!showWeightModal) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowWeightModal(false);
        setWeightInput('');
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [showWeightModal]);

  const handleComplete = () => {
    markWorkoutComplete();
    // In a real app we'd play a sound or show confetti here
  };

  const handleCompleteJog = (distanceKm) => {
    addJogLog(distanceKm);
    markWorkoutComplete();
    setActiveTab('workout');
  };

  const handleApplyWorkoutPlan = (workout) => {
    if (!workout || !Array.isArray(workout.routine) || workout.routine.length === 0) return;

    const normalizedWorkout = {
      phase: Number.isFinite(workout.phase) ? workout.phase : 1,
      title: workout.title || 'Custom Workout Plan',
      description: workout.description || 'Custom workout imported into your daily mission.',
      intensity: workout.intensity || 'Medium',
      routine: workout.routine.filter((step) => typeof step === 'string' && step.trim().length > 0),
    };

    if (normalizedWorkout.routine.length === 0) return;

    setCustomWorkoutForToday({ day: currentDay, workout: normalizedWorkout });
    clearTodayProgress();
    setActiveTab('workout');
  };

  const handleReset = () => {
    if (showResetConfirm) {
      resetProgress();
      setCustomWorkoutForToday(null);
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  const handleSnacked = () => {
    if (!isTodayCompleted && currentWorkout) {
      addPunishment(getSnackPunishment());
    }
  };

  const handleLogWeightClick = () => {
    setShowWeightModal(true);
  };

  const closeWeightModal = () => {
    setShowWeightModal(false);
    setWeightInput('');
  };

  const handleLogWeightConfirm = () => {
    const parsedWeight = Number.parseFloat(weightInput);
    if (!Number.isNaN(parsedWeight) && parsedWeight > 0) {
      addWeightLog(parsedWeight);
      closeWeightModal();
    }
  };

  const parsedWeightInput = Number.parseFloat(weightInput);
  const isWeightInputValid = !Number.isNaN(parsedWeightInput) && parsedWeightInput > 0;

  return (
    <div className="max-w-md md:max-w-5xl mx-auto min-h-screen bg-black text-white px-4 sm:px-6 md:px-10 pb-32 pt-6 sm:pt-8 md:pt-10 font-sans tracking-tight">
      {/* Header Profile Area - Global */}
      <header className="flex flex-wrap justify-between items-center gap-4 mb-8 sm:mb-10 mt-safe">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
            GyMPal
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Consistency is key</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button 
            type="button"
            onClick={generateCalendarInvite}
            title="Set daily iOS calendar reminder"
            aria-label="Download daily calendar reminder"
            className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition-colors"
          >
            <CalendarPlus size={20} className="text-zinc-400" />
          </button>
          {!isTodayCompleted && currentWorkout && (
            <button 
              type="button"
              onClick={handleSnacked}
              aria-label="Log a snack slip and add a punishment exercise"
              className="h-11 sm:h-12 px-3 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold flex items-center gap-1.5 hover:bg-red-500/20 active:scale-95 transition-all"
            >
              <AlertTriangle size={16} />
              Snacked
            </button>
          )}
          <div aria-hidden="true" className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 p-0.5 shadow-[0_0_15px_rgba(56,189,248,0.4)]">
            <div className="h-full w-full rounded-full bg-black flex items-center justify-center border-2 border-black">
              <Trophy size={20} className="text-emerald-400" />
            </div>
          </div>
        </div>
      </header>

      {activeTab === 'workout' ? (
        <section aria-label="Workout dashboard" className="flex flex-col md:flex-row md:gap-12">
          {/* Left Column (Motivation, Stats) */}
          <div className="w-full md:w-5/12">
            {/* Quote Card (The Anime Motivation Engine) */}
            <div className="relative mb-10 p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-emerald-500"></div>
              <div className="absolute -right-4 -top-4 text-zinc-800 opacity-20">
                <Flame size={120} />
              </div>
              <blockquote className="relative z-10">
                <p className="text-lg italic font-medium text-zinc-100 mb-4">"{dailyQuote.quote}"</p>
                <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  — {dailyQuote.author}
                </p>
              </blockquote>
            </div>

            {/* Stats Grid - Workout only */}
            <div className="grid grid-cols-2 gap-3 mb-10">
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center shadow-lg">
                <Calendar className="text-blue-400 mb-2" size={20} />
                <span className="text-3xl font-extrabold text-white">{currentDay}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">Day</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                {streak > 3 && (
                  <div className="absolute inset-0 bg-orange-500/10 animate-pulse"></div>
                )}
                <Flame className={streak > 0 ? "text-orange-500 mb-2" : "text-zinc-600 mb-2"} size={20} />
                <span className="text-3xl font-extrabold text-white">{streak}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">Streak</span>
              </div>
            </div>
          </div> 

          {/* Right Column (Mission, Progress, Reset) */}
          <div className="w-full md:w-7/12 md:mt-2">
            {/* Rest Day or Workout */}
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Activity size={20} className="text-emerald-400" />
              {currentWorkout ? "Today's Mission" : "Active Recovery"}
            </h3>

            {currentWorkout ? (
              <WorkoutCard 
                workout={currentWorkout} 
                punishments={punishments}
                dailyProgress={dailyProgress}
                toggleExercise={toggleExercise}
                isCompleted={isTodayCompleted} 
                onComplete={handleComplete} 
              />
            ) : (
              <WeekendRecovery proteinStreak={proteinStreak} logProteinGoal={logProteinGoal} />
            )}

            {/* 180 Day Progress Bar (Mini view) */}
            <div className="mt-12 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <div className="flex justify-between text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wider">
                <span>Journey</span>
                <span>{Math.round((currentDay / 180) * 100)}%</span>
              </div>
              <div
                className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden"
                role="progressbar"
                aria-label="180 day journey progress"
                aria-valuemin={0}
                aria-valuemax={180}
                aria-valuenow={currentDay}
              >
                <div 
                  className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${
                    currentDay <= 60 ? 'from-blue-600 to-blue-400' : 
                    currentDay <= 120 ? 'from-orange-600 to-yellow-500' : 
                    'from-red-600 to-orange-500'
                  }`}
                  style={{ width: `${(currentDay / 180) * 100}%` }}
                />
              </div>
              <p className="text-center text-xs text-zinc-500 mt-4 leading-relaxed">
                {180 - currentDay} days remaining out of 180.
              </p>
            </div>
            
            {/* Danger Zone */}
            <div className="mt-16 text-center">
              <button 
                type="button"
                onClick={handleReset}
                className={`text-xs px-4 py-2 rounded-full border transition-colors ${
                  showResetConfirm 
                    ? 'border-red-500 text-red-500 bg-red-500/10' 
                    : 'border-zinc-800 text-zinc-600 hover:text-zinc-400'
                }`}
              >
                <RefreshCw size={12} className="inline mr-2 -mt-0.5" />
                {showResetConfirm ? 'Click again to wipe data' : 'Reset Progress'}
              </button>
            </div>
          </div>
        </section>
      ) : activeTab === 'stats' ? (
        <section aria-label="Stats dashboard" className="max-w-4xl mx-auto">
          <Suspense
            fallback={(
              <div className="h-64 mb-10 rounded-2xl bg-zinc-900/60 border border-zinc-800 animate-pulse" aria-hidden="true" />
            )}
          >
            <ProgressOverview history={history} jogLogs={jogLogs} />
          </Suspense>

          {/* Stats Grid - Food Only */}
          <div className="grid grid-cols-1 gap-4 mb-10">
            <button
              type="button"
              className="w-full bg-zinc-900 border border-emerald-900/30 p-6 rounded-2xl flex flex-col items-center justify-center shadow-lg relative cursor-pointer hover:bg-zinc-800 transition-colors"
              onClick={logProteinGoal}
              aria-label="Log protein goal completion for today"
            >
              {proteinStreak > 0 && (
                <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>
              )}
              <div className="text-3xl mb-2">{proteinStreak > 0 ? '🔥' : '🥩'}</div>
              <span className="text-4xl font-extrabold text-white">{proteinStreak}</span>
              <span className="text-xs text-zinc-500 uppercase tracking-widest mt-2 font-bold">Protein Hits</span>
            </button>
          </div>

          {/* Weight Tracking */}
          <div className="mb-10 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity size={18} className="text-blue-400" /> 
                  75kg Final Cut Tracker
                </h3>
                <p className="text-xs text-zinc-400 mt-1">Weight goal: 75kg • Trend history</p>
              </div>
              <button 
                type="button"
                onClick={handleLogWeightClick}
                aria-label="Log current body weight"
                className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center hover:bg-blue-500/30 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <Suspense
              fallback={(
                <div className="h-64 mt-4 rounded-xl bg-zinc-900/60 border border-zinc-800 animate-pulse" aria-hidden="true" />
              )}
            >
              <WeightChart data={weightLogs} target={75} />
            </Suspense>
          </div>

          {latestWeight && (
            <div className="mb-10">
              <Suspense
                fallback={(
                  <div className="h-32 rounded-2xl bg-zinc-900/60 border border-zinc-800 animate-pulse" aria-hidden="true" />
                )}
              >
                <BMIProgressRing weight={latestWeight} />
              </Suspense>
            </div>
          )}

          <Suspense
            fallback={(
              <div className="h-64 mb-10 rounded-2xl bg-zinc-900/60 border border-zinc-800 animate-pulse" aria-hidden="true" />
            )}
          >
            <ExerciseLibraryPanel />
          </Suspense>
          <AIWorkoutGeneratorPanel onApplyWorkout={handleApplyWorkoutPlan} />
          <ShareExportPanel currentWorkout={currentWorkout} onApplyWorkout={handleApplyWorkoutPlan} />
        </section>
      ) : (
        <JogWorkoutTab isTodayCompleted={isTodayCompleted} onCompleteJog={handleCompleteJog} />
      )}

      {/* Bottom Navigation */}
      <nav
        aria-label="Primary"
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex justify-center gap-3 w-[calc(100%-2rem)] max-w-md bg-zinc-900/90 backdrop-blur-md p-3 rounded-full border border-zinc-800 shadow-xl shadow-black/50"
      >
        <button 
          type="button"
          onClick={() => setActiveTab('workout')} 
          aria-label="Show workout tab"
          aria-pressed={activeTab === 'workout'}
          className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${activeTab === 'workout' ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110' : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
        >
          <Dumbbell size={24} className={activeTab === 'workout' ? "animate-in zoom-in" : ""} />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('jog')}
          aria-label="Show jog tab"
          aria-pressed={activeTab === 'jog'}
          className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${activeTab === 'jog' ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-110' : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
        >
          <Activity size={24} className={activeTab === 'jog' ? "animate-in zoom-in" : ""} />
        </button>
        
        <button 
          type="button"
          onClick={() => setActiveTab('stats')} 
          aria-label="Show stats tab"
          aria-pressed={activeTab === 'stats'}
          className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${activeTab === 'stats' ? 'bg-blue-500 text-black shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-110' : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
        >
          <Utensils size={24} className={activeTab === 'stats' ? "animate-in zoom-in" : ""} />
        </button>
      </nav>

      {/* Weight Log Modal */}
      {showWeightModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeWeightModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="weight-log-title"
            aria-describedby="weight-log-description"
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95"
          >
            <h3 id="weight-log-title" className="text-xl font-bold text-white mb-2">Log Weekly Weight</h3>
            <p id="weight-log-description" className="text-sm text-zinc-400 mb-6">Enter your current weight to track your progress towards 75kg.</p>
            
            <div className="relative mb-6">
              <label htmlFor={weightInputId} className="sr-only">Current weight in kilograms</label>
              <input
                id={weightInputId}
                type="number"
                step="0.1"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder="e.g. 78.5"
                className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleLogWeightConfirm()}
                inputMode="decimal"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">kg</span>
            </div>
            
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={closeWeightModal}
                className="flex-1 py-3 rounded-xl font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleLogWeightConfirm}
                disabled={!isWeightInputValid}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Log
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
