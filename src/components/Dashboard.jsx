import React, { useState } from 'react';
import { getWorkoutForDay, getSnackPunishment, isWeekend } from '../data/workoutData';
import { getRandomQuote } from '../data/quotes';
import { useWorkout } from '../hooks/useWorkout';
import WorkoutCard from './WorkoutCard';
import WeightChart from './WeightChart';
import BMIProgressRing from './BMIProgressRing';
import { Trophy, Flame, Calendar, Activity, RefreshCw, AlertTriangle, CalendarPlus, Plus } from 'lucide-react';

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
  const { 
    currentDay, 
    streak, 
    isTodayCompleted, 
    dailyProgress,
    punishments,
    proteinStreak,
    weightLogs,
    markWorkoutComplete, 
    toggleExercise,
    addPunishment,
    logProteinGoal,
    addWeightLog,
    resetProgress 
  } = useWorkout();
  
  const latestWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : null;

  const today = new Date();
  const isRestDay = isWeekend(today);
  
  const currentWorkout = isRestDay ? null : getWorkoutForDay(currentDay);
  
  // Rotate quotes every 5 minutes (300,000 ms)
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [dailyQuote, setDailyQuote] = useState(() => getRandomQuote(currentWorkout?.intensity || 'Medium'));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDailyQuote(getRandomQuote(currentWorkout?.intensity || 'Medium'));
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [currentWorkout?.intensity]);

  const handleComplete = () => {
    markWorkoutComplete();
    // In a real app we'd play a sound or show confetti here
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
    if (!isTodayCompleted) {
      addPunishment(getSnackPunishment());
    }
  };

  const handleLogWeightClick = () => {
    setShowWeightModal(true);
  };

  const handleLogWeightConfirm = () => {
    if (weightInput && !isNaN(weightInput)) {
      addWeightLog(parseFloat(weightInput));
      setShowWeightModal(false);
      setWeightInput('');
    }
  };

  return (
    <div className="max-w-md md:max-w-5xl mx-auto min-h-screen bg-black text-white px-6 md:px-10 pb-24 pt-10 font-sans tracking-tight">
      <div className="flex flex-col md:flex-row md:gap-12">
        {/* Left Column (Header, Motivation, Stats) */}
        <div className="w-full md:w-5/12">
      {/* Header Profile Area */}
      <header className="flex justify-between items-center mb-10 mt-safe">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
            GyMPal
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Consistency is key</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={generateCalendarInvite}
            title="Set daily iOS calendar reminder"
            className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition-colors"
          >
            <CalendarPlus size={20} className="text-zinc-400" />
          </button>
          {!isTodayCompleted && !isRestDay && (
            <button 
              onClick={handleSnacked}
              className="h-12 px-3 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold flex items-center gap-1.5 hover:bg-red-500/20 active:scale-95 transition-all"
            >
              <AlertTriangle size={16} />
              Snacked
            </button>
          )}
          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 p-0.5 shadow-[0_0_15px_rgba(56,189,248,0.4)]">
            <div className="h-full w-full rounded-full bg-black flex items-center justify-center border-2 border-black">
              <Trophy size={20} className="text-emerald-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Quote Card (The Anime Motivation Engine) */}
      <div className="relative mb-10 p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-emerald-500"></div>
        <div className="absolute -right-4 -top-4 text-zinc-800 opacity-20">
          <Flame size={120} />
        </div>
        <p className="text-lg italic font-medium text-zinc-100 mb-4 relative z-10">"{dailyQuote.quote}"</p>
        <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 relative z-10">
          — {dailyQuote.author}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-10">
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
        <div className="bg-zinc-900 border border-emerald-900/30 p-4 rounded-2xl flex flex-col items-center justify-center shadow-lg relative cursor-pointer hover:bg-zinc-800 transition-colors" onClick={logProteinGoal}>
          {proteinStreak > 0 && (
            <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>
          )}
          <div className="text-xl mb-2">{proteinStreak > 0 ? '🔥' : '🥩'}</div>
          <span className="text-3xl font-extrabold text-white">{proteinStreak}</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">Protein</span>
        </div>
      </div>
      
      {/* Weight Tracking */}
      <div className="mb-10 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-blue-400" /> 
              70kg Final Cut Tracker
            </h3>
            <p className="text-xs text-zinc-400 mt-1">Weight goal: 70kg • Trend history</p>
          </div>
          <button 
            onClick={handleLogWeightClick}
            className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center hover:bg-blue-500/30 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        <WeightChart data={weightLogs} target={70} />
      </div>

      {latestWeight && (
        <div className="mb-10">
          <BMIProgressRing weight={latestWeight} />
        </div>
      )}

      </div> {/* End Left Column */}

      {/* Right Column (Mission, Progress, Reset) */}
      <div className="w-full md:w-7/12 md:mt-2">
      {/* Rest Day or Workout */}
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Activity size={20} className="text-emerald-400" />
        {isRestDay ? "Active Recovery" : "Today's Mission"}
      </h3>

      {isRestDay ? (
        <div className="mb-10 p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
              <span className="text-3xl text-blue-500">🧘‍♂️</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-sky-400">Recovery Recharge</h2>
              <p className="text-zinc-400 text-sm mt-1">Muscle is built in the kitchen and the bed. Focus on your 130g protein goal today.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 cursor-pointer transition-colors border border-transparent hover:border-zinc-700">
              <input type="checkbox" className="w-5 h-5 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500 bg-zinc-900 mr-4" />
              <div className="flex-1">
                <span className="font-medium text-white block">Sleep Tracker</span>
                <span className="text-xs text-zinc-400">Did you get 8 hours of sleep?</span>
              </div>
            </label>

            <label className="flex items-center p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 cursor-pointer transition-colors border border-transparent hover:border-zinc-700">
              <input type="checkbox" className="w-5 h-5 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500 bg-zinc-900 mr-4" onChange={logProteinGoal} checked={proteinStreak > 0 && new Date().toISOString().split('T')[0] === localStorage.getItem('gympal_last_protein_date')} />
              <div className="flex-1">
                <span className="font-medium text-white block">Protein Goal</span>
                <span className="text-xs text-zinc-400">Target: 130g of protein today</span>
              </div>
            </label>

            <a href="https://www.youtube.com/results?search_query=10+minute+full+body+stretch" target="_blank" rel="noopener noreferrer" className="flex items-center p-4 rounded-xl bg-blue-900/20 hover:bg-blue-900/40 cursor-pointer transition-colors border border-blue-900/30">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mr-4 shrink-0">
                <span className="text-[10px] text-white">▶</span>
              </div>
              <div className="flex-1">
                <span className="font-medium text-blue-100 block">Mobility Video</span>
                <span className="text-xs text-blue-300">10-minute full-body stretch</span>
              </div>
            </a>
          </div>
        </div>
      ) : (
        <WorkoutCard 
          workout={currentWorkout} 
          punishments={punishments}
          dailyProgress={dailyProgress}
          toggleExercise={toggleExercise}
          isCompleted={isTodayCompleted} 
          onComplete={handleComplete} 
        />
      )}

      {/* 180 Day Progress Bar (Mini view) */}
      <div className="mt-12 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
        <div className="flex justify-between text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wider">
          <span>Journey</span>
          <span>{Math.round((currentDay / 180) * 100)}%</span>
        </div>
        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-1000"
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

      </div> {/* End Right Column */}
      </div> {/* End Flex Container */}

      {/* Weight Log Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-white mb-2">Log Weekly Weight</h3>
            <p className="text-sm text-zinc-400 mb-6">Enter your current weight to track your progress towards 70kg.</p>
            
            <div className="relative mb-6">
              <input
                type="number"
                step="0.1"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder="e.g. 78.5"
                className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleLogWeightConfirm()}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">kg</span>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => { setShowWeightModal(false); setWeightInput(''); }}
                className="flex-1 py-3 rounded-xl font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogWeightConfirm}
                disabled={!weightInput || isNaN(weightInput)}
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
