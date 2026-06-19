import React, { Suspense, lazy, useEffect, useState, useMemo } from 'react';
import { getWorkoutForDay, getSnackPunishment, isWeekend, QUICK_START_WORKOUT } from '../data/workoutData';
import { getRandomQuote } from '../data/quotes';
import { useWorkout } from '../hooks/useWorkout';
import { useTemplates } from '../hooks/useTemplates';
import WorkoutCard from './WorkoutCard';
import JogWorkoutTab from './JogWorkoutTab';
import WeekendRecovery from './WeekendRecovery';
import SkillTree from './SkillTree';
import { Trophy, Flame, Activity, RefreshCw, AlertTriangle, CalendarPlus, Plus, Dumbbell, BarChart2, Sparkles, Target, TrendingUp, Medal } from 'lucide-react';

const WeightChart = lazy(() => import('./WeightChart'));
const BMIProgressRing = lazy(() => import('./BMIProgressRing'));
const ProgressOverview = lazy(() => import('./ProgressOverview'));
const DailyPlanner = lazy(() => import('./DailyPlanner'));
const TemplateManager = lazy(() => import('./TemplateManager'));
const CalendarView = lazy(() => import('./CalendarView'));
const MuscleHeatmap = lazy(() => import('./MuscleHeatmap'));

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
  const [activeTab, setActiveTab] = useState('workout'); // 'workout', 'jog', 'habits', 'stats', or 'skills'
  const [workoutModeActive, setWorkoutModeActive] = useState(false);
  const [useQuickStart, setUseQuickStart] = useState(false);
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
    exerciseLogs,
    todayExerciseLogs,
    storageError,
    markWorkoutComplete, 
    toggleExercise,
    addPunishment,
    logProteinGoal,
    addWeightLog,
    addJogLog,
    logExerciseSet,
    addExerciseSet,
    removeExerciseSet,
    getPR,
    getExerciseWeeklyVolume,
    resetProgress 
  } = useWorkout();

  const {
    templates,
    activeTemplate,
    selectedDay,
    setActiveTemplate,
    clearActiveTemplate,
    saveTemplate,
    deleteTemplate,
    getTemplateForToday,
    advanceDay,
    storageError: templatesStorageError,
  } = useTemplates();
  
  const latestWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : null;

  // Compute best streak from history (consecutive weekdays)
  const bestStreak = useMemo(() => {
    const sorted = [...history].sort();
    if (sorted.length === 0) return 0;

    let maxRun = 0;
    let currentRun = 0;
    let prevDate = null;

    for (const dateStr of sorted) {
      const d = new Date(dateStr + 'T00:00:00');
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      if (isWeekend) continue; // skip weekends

      if (prevDate) {
        const prev = new Date(prevDate + 'T00:00:00');
        const diff = Math.round((d - prev) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
          currentRun++;
        } else if (diff > 1) {
          // Check if gap was just a weekend
          const prevDay = prev.getDay();
          const expectedGap = prevDay === 5 ? 3 : 1; // Fri→Mon = 3 days, else 1
          if (diff <= expectedGap) {
            currentRun++;
          } else {
            maxRun = Math.max(maxRun, currentRun);
            currentRun = 1;
          }
        }
      } else {
        currentRun = 1;
      }
      prevDate = dateStr;
    }
    maxRun = Math.max(maxRun, currentRun);
    return maxRun;
  }, [history]);

  const today = new Date();
  const isRestDay = isWeekend(today);

  const defaultWorkout = isRestDay ? null : getWorkoutForDay(currentDay);

  const templateToday = getTemplateForToday();
  const templateWorkout = templateToday ? {
    phase: 1,
    title: templateToday.name,
    description: `From template: ${templateToday.templateName}`,
    intensity: 'Medium',
    routine: templateToday.exercises.map((e) => `${e.name} ${e.sets}x${e.reps}`)
  } : null;

  const isNewUser = history.length === 0 && !templateToday;
  const quickStartWorkout = isNewUser && useQuickStart ? QUICK_START_WORKOUT : null;

  const currentWorkout = templateWorkout || quickStartWorkout || defaultWorkout;
  
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

  const handleReset = () => {
    if (showResetConfirm) {
      resetProgress();
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
    <div className="max-w-md md:max-w-5xl mx-auto min-h-screen bg-black text-white px-4 sm:px-6 md:px-10 font-sans tracking-tight" style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top, 0px))', paddingBottom: 'calc(8rem + env(safe-area-inset-bottom, 0px))' }}>
      {/* Header Profile Area - Global */}
      <header className="flex flex-wrap justify-between items-center gap-4 mb-8 sm:mb-10 mt-safe">
        <div className="flex items-center gap-3">
          {/* Logo icon */}
          <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-black border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)] flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 192 192" fill="none" className="sm:w-[26px] sm:h-[26px]">
              <path d="M69 79C69 73 74 69 79 69H112C115 69 118 71 118 74C118 78 115 80 112 80H86V90H105C110 90 115 94 115 100V113C115 119 110 123 105 123H82C77 123 72 119 72 113V94" 
                    stroke="#10b981" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              <path d="M128 128L142 113L157 128" stroke="#10b981" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              <line x1="142" y1="113" x2="142" y2="139" stroke="#10b981" stroke-width="7" stroke-linecap="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              GyMPal
            </h1>
            <p className="text-xs sm:text-sm text-emerald-400/80 font-medium tracking-wide flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-500" />
              Level Up Every Day
            </p>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button 
            type="button"
            onClick={generateCalendarInvite}
            title="Set daily iOS calendar reminder"
            aria-label="Download daily calendar reminder"
            className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-200"
          >
            <CalendarPlus size={20} className="text-zinc-400" />
          </button>
          {!isTodayCompleted && currentWorkout && (
            <button 
              type="button"
              onClick={handleSnacked}
              aria-label="Log a snack slip and add a punishment exercise"
              className="h-11 sm:h-12 px-3 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold flex items-center gap-1.5 hover:bg-red-500/20 transition-all duration-200"
            >
              <AlertTriangle size={16} />
              Snacked
            </button>
          )}
          <div aria-hidden="true" className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-300 p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <div className="h-full w-full rounded-full bg-black flex items-center justify-center border-2 border-black">
              <Trophy size={20} className="text-emerald-400" />
            </div>
          </div>
        </div>
      </header>

      {storageError && (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
          {storageError}
        </div>
      )}

      {/* Active Workout Mode — full-screen distraction-free */}
      {workoutModeActive && currentWorkout && (
        <div className="fixed inset-0 z-[60] bg-zinc-950 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-4 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {useQuickStart ? 'Quick Start' : templateWorkout ? templateToday?.name : 'Workout'}
                </h2>
                <p className="text-xs text-zinc-500">{currentWorkout.intensity} &bull; {currentWorkout.routine?.length || 0} exercises</p>
              </div>
              <button
                type="button"
                onClick={() => setWorkoutModeActive(false)}
                className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-all active:scale-95"
              >
                ✕ Exit
              </button>
            </div>
            <WorkoutCard 
              workout={currentWorkout} 
              punishments={punishments}
              dailyProgress={dailyProgress}
              toggleExercise={toggleExercise}
              isCompleted={isTodayCompleted} 
              onComplete={handleComplete} 
              exerciseLogs={exerciseLogs}
              todayExerciseLogs={todayExerciseLogs}
              logExerciseSet={logExerciseSet}
              addExerciseSet={addExerciseSet}
              removeExerciseSet={removeExerciseSet}
              getPR={getPR}
              getExerciseWeeklyVolume={getExerciseWeeklyVolume}
            />
          </div>
        </div>
      )}

      {activeTab === 'workout' ? (
        <section aria-label="Workout dashboard" className="flex flex-col md:flex-row md:gap-12">
          {/* Left Column (Motivation, Stats) */}
          <div className="w-full md:w-5/12">
            {/* Quote Card (The Anime Motivation Engine) — Premium */}
            <div className="relative mb-10 p-7 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-black border border-zinc-800/80 overflow-hidden group">
              {/* Gradient border accent */}
              <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-b from-emerald-500/20 via-transparent to-zinc-800/0 pointer-events-none [mask:linear-gradient(#fff,#fff)_content-box,linear-gradient(#fff,#fff)] [mask-composite:exclude]" />
              {/* Left accent bar */}
              <div className="absolute top-3 left-0 w-[3px] h-[calc(100%-1.5rem)] rounded-full bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500 opacity-80"></div>
              {/* Decorative flame glow */}
              <div className="absolute -right-6 -top-6 text-zinc-800/10 group-hover:opacity-20 transition-opacity duration-700">
                <Flame size={140} />
              </div>
              <blockquote className="relative z-10 pl-4">
                <p className="text-lg italic font-medium text-zinc-100 mb-3 leading-relaxed">"{dailyQuote.quote}"</p>
                <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">
                  — {dailyQuote.author}
                </p>
              </blockquote>
            </div>

            {/* Stats Grid - Habit Focused */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {/* Streak Hero — Full width */}
              <div className={`relative bg-zinc-900/80 border ${streak > 0 ? 'border-orange-500/40' : 'border-zinc-800/80'} p-6 rounded-2xl flex flex-col items-center justify-center shadow-lg overflow-hidden backdrop-blur-sm group`}>
                <div className={`absolute inset-0 rounded-2xl p-px bg-gradient-to-b ${streak > 0 ? 'from-orange-500/30' : 'from-zinc-500/10'} via-transparent to-transparent pointer-events-none [mask:linear-gradient(#fff,#fff)_content-box,linear-gradient(#fff,#fff)] [mask-composite:exclude]`} />
                {streak > 2 && (
                  <div className="absolute inset-0 bg-orange-500/[0.07] animate-pulse rounded-2xl"></div>
                )}
                <Flame className={streak > 0 ? "text-orange-400 mb-1 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]" : "text-zinc-600 mb-1"} size={28} />
                <span className={`text-5xl font-extrabold tracking-tight ${streak > 0 ? 'text-orange-300' : 'text-white'}`}>{streak}</span>
                <span className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-semibold">Day Streak</span>
                {streak > 0 && (
                  <span className="text-[11px] text-orange-500/70 mt-1 font-medium">
                    {streak === 1 ? 'Keep it going!' : streak < 5 ? 'Building momentum!' : streak < 14 ? 'Now we\'re talking!' : 'Unstoppable!'}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="relative bg-zinc-900/80 border border-zinc-800/80 p-4 rounded-2xl flex flex-col items-center justify-center shadow-lg backdrop-blur-sm group">
                <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-b from-amber-500/15 via-transparent to-transparent pointer-events-none [mask:linear-gradient(#fff,#fff)_content-box,linear-gradient(#fff,#fff)] [mask-composite:exclude]" />
                <Medal className="text-amber-400/80 mb-1.5 group-hover:scale-110 transition-transform duration-300" size={18} />
                <span className="text-2xl font-extrabold text-white tracking-tight">{bestStreak}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-semibold">Best Streak</span>
              </div>
              <div className="relative bg-zinc-900/80 border border-zinc-800/80 p-4 rounded-2xl flex flex-col items-center justify-center shadow-lg backdrop-blur-sm group">
                <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-b from-blue-500/15 via-transparent to-transparent pointer-events-none [mask:linear-gradient(#fff,#fff)_content-box,linear-gradient(#fff,#fff)] [mask-composite:exclude]" />
                <Activity className="text-blue-400/80 mb-1.5 group-hover:scale-110 transition-transform duration-300" size={18} />
                <span className="text-2xl font-extrabold text-white tracking-tight">{history.length}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-semibold">Total Days</span>
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

            <Suspense fallback={null}>
              <TemplateManager
                templates={templates}
                activeTemplate={activeTemplate}
                selectedDay={selectedDay}
                setActiveTemplate={setActiveTemplate}
                clearActiveTemplate={clearActiveTemplate}
                saveTemplate={saveTemplate}
                deleteTemplate={deleteTemplate}
                getTemplateForToday={getTemplateForToday}
                advanceDay={advanceDay}
                storageError={templatesStorageError}
              />
            </Suspense>

            {/* Quick Start prompt for brand-new users */}
            {isNewUser && !useQuickStart && (
              <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 text-center">
                <h4 className="text-lg font-bold text-white mb-2">Welcome to GyMPal! 🎉</h4>
                <p className="text-sm text-zinc-400 mb-4">
                  No workout history yet — start with a beginner-friendly full-body session to get moving.
                </p>
                <button
                  type="button"
                  onClick={() => setUseQuickStart(true)}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/25"
                >
                  Quick Start Workout
                </button>
              </div>
            )}

            {currentWorkout ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Activity size={20} className="text-emerald-400" />
                    {templateWorkout ? "Today's Template" : useQuickStart ? "Quick Start" : "Today's Mission"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setWorkoutModeActive(p => !p)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all active:scale-90 ${
                      workoutModeActive
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'border-zinc-700 text-zinc-400 hover:text-white'
                    }`}
                    aria-label={workoutModeActive ? 'Exit focus mode' : 'Enter focus mode'}
                  >
                    {workoutModeActive ? '✕ Exit Focus' : '⛶ Focus'}
                  </button>
                </div>
                <WorkoutCard 
                  workout={currentWorkout} 
                  punishments={punishments}
                  dailyProgress={dailyProgress}
                  toggleExercise={toggleExercise}
                  isCompleted={isTodayCompleted} 
                  onComplete={handleComplete} 
                  exerciseLogs={exerciseLogs}
                  todayExerciseLogs={todayExerciseLogs}
                  logExerciseSet={logExerciseSet}
                  addExerciseSet={addExerciseSet}
                  removeExerciseSet={removeExerciseSet}
                  getPR={getPR}
                  getExerciseWeeklyVolume={getExerciseWeeklyVolume}
                />
              </>
            ) : (
              <WeekendRecovery proteinStreak={proteinStreak} logProteinGoal={logProteinGoal} />
            )}


            
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
      ) : activeTab === 'habits' ? (
        <section aria-label="Daily Habits" className="max-w-4xl mx-auto">
          <Suspense
            fallback={(
              <div className="h-64 mb-10 rounded-2xl bg-zinc-900/60 border border-zinc-800 animate-pulse" aria-hidden="true" />
            )}
          >
            <DailyPlanner />
          </Suspense>
        </section>
      ) : activeTab === 'stats' ? (
        <section aria-label="Stats and Explore dashboard" className="max-w-4xl mx-auto">
          <Suspense
            fallback={(
              <div className="h-64 mb-10 rounded-2xl bg-zinc-900/60 border border-zinc-800 animate-pulse" aria-hidden="true" />
            )}
          >
            <CalendarView history={history} exerciseLogs={exerciseLogs} currentStreak={streak} />
          </Suspense>

          <Suspense
            fallback={(
              <div className="h-64 mb-10 rounded-2xl bg-zinc-900/60 border border-zinc-800 animate-pulse" aria-hidden="true" />
            )}
          >
            <ProgressOverview history={history} jogLogs={jogLogs} />
          </Suspense>

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

          <Suspense
            fallback={(
              <div className="h-64 mb-10 rounded-2xl bg-zinc-900/60 border border-zinc-800 animate-pulse" aria-hidden="true" />
            )}
          >
            <MuscleHeatmap
              exerciseLogs={exerciseLogs}
              routine={currentWorkout?.routine || []}
            />
          </Suspense>

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

        </section>
      ) : activeTab === 'skills' ? (
        <section aria-label="Skills dashboard" className="max-w-4xl mx-auto p-6">
          <SkillTree />
        </section>
      ) : (
        <section aria-label="Jog tab" className="max-w-xl mx-auto">
          <JogWorkoutTab isTodayCompleted={isTodayCompleted} onCompleteJog={handleCompleteJog} currentDay={currentDay} />
        </section>
      )}

      {/* Bottom Navigation — Premium Pill (hidden in Active Workout Mode) */}
      {!workoutModeActive && (
      <nav
        aria-label="Primary"
        className="fixed left-1/2 -translate-x-1/2 z-50 flex justify-center items-center gap-3 w-[calc(100%-2rem)] max-w-md bg-zinc-900/95 backdrop-blur-xl p-3 rounded-full border border-zinc-800/80 shadow-2xl shadow-black/60"
        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <button 
          type="button"
          onClick={() => setActiveTab('workout')} 
          aria-label="Show workout tab"
          aria-pressed={activeTab === 'workout'}
          className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 active:scale-90 ${activeTab === 'workout' ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-110' : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
        >
          <Dumbbell size={24} className={activeTab === 'workout' ? "animate-in zoom-in" : ""} />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('jog')}
          aria-label="Show jog tab"
          aria-pressed={activeTab === 'jog'}
          className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 active:scale-90 ${activeTab === 'jog' ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-110' : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
        >
          <Activity size={24} className={activeTab === 'jog' ? "animate-in zoom-in" : ""} />
        </button>
        
        <button 
          type="button"
          onClick={() => setActiveTab('habits')} 
          aria-label="Show habits tab"
          aria-pressed={activeTab === 'habits'}
          className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 active:scale-90 ${activeTab === 'habits' ? 'bg-blue-500 text-black shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-110' : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
        >
          <Target size={24} className={activeTab === 'habits' ? "animate-in zoom-in" : ""} />
        </button>

        <button 
          type="button"
          onClick={() => setActiveTab('stats')} 
          aria-label="Show stats tab"
          aria-pressed={activeTab === 'stats'}
          className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 active:scale-90 ${activeTab === 'stats' ? 'bg-purple-500 text-black shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-110' : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
        >
          <BarChart2 size={24} className={activeTab === 'stats' ? "animate-in zoom-in" : ""} />
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('skills')} 
          aria-label="Show skills tab"
          aria-pressed={activeTab === 'skills'}
          className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 active:scale-90 ${activeTab === 'skills' ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.5)] scale-110' : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
        >
          <Sparkles size={24} className={activeTab === 'skills' ? "animate-in zoom-in" : ""} />
        </button>
      </nav>
      )}

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
