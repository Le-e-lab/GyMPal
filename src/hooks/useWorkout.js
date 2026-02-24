import { useState } from 'react';

// Start date: Let's assume today is Day 1
const getStartDate = () => {
  const storedDate = localStorage.getItem('gympal_start_date');
  if (storedDate) {
    return new Date(storedDate);
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  localStorage.setItem('gympal_start_date', today.toISOString());
  return today;
};

// Hook to manage streak, days and workout status
export const useWorkout = () => {
  const [history, setHistory] = useState(() => {
    // History stores completed dates: YYYY-MM-DD
    const stored = localStorage.getItem('gympal_history');
    return stored ? JSON.parse(stored) : [];
  });

  // Derived state (no useEffect needed)
  const startDate = getStartDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Need to normalize to midnight local time for correct day diff
  
  // Calculate elapsed days
  // Use UTC to avoid DST issues
  const utc1 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const utc2 = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const diffDays = Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24));
  
  // We cap it at day 180 (6 months)
  const currentDay = Math.min(diffDays + 1, 180);

  // Normalize today to a string for history checking
  const todayStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000 )).toISOString().split('T')[0];
  const isTodayCompleted = history.includes(todayStr);

  // Calculate streak (consecutive weekdays)
  let streak = 0;
  let checkDate = new Date(today); // Local time checkDate
  
  while(true) {
    if (checkDate > today) break;

    const dateStr = new Date(checkDate.getTime() - (checkDate.getTimezoneOffset() * 60000 )).toISOString().split('T')[0];
    const dayOfWeek = checkDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (history.includes(dateStr)) {
      streak++;
    } else if (!isWeekend && dateStr !== todayStr) {
      // Missed a weekday (and it's not today yet) -> streak breaks
      break;
    }
    
    // Go back one day
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Track daily checkbox progress (array of completed exercise indices)
  const [dailyProgress, setDailyProgress] = useState(() => {
    const stored = localStorage.getItem('gympal_daily_progress');
    // Ensure we only load progress for *today*
    if (stored) {
      const parsed = JSON.parse(stored);
      const todayStr = new Date().toISOString().split('T')[0];
      if (parsed.date === todayStr) return parsed.progress;
    }
    return [];
  });

  // Track extra punishment exercises added today (array of strings)
  const [punishments, setPunishments] = useState(() => {
    const stored = localStorage.getItem('gympal_punishments');
    if (stored) {
      const parsed = JSON.parse(stored);
      const todayStr = new Date().toISOString().split('T')[0];
      if (parsed.date === todayStr) return parsed.list;
    }
    return [];
  });

  const markWorkoutComplete = () => {
    if (!history.includes(todayStr)) {
      const newHistory = [...history, todayStr];
      setHistory(newHistory);
      localStorage.setItem('gympal_history', JSON.stringify(newHistory));
    }
  };
  
  const toggleExercise = (index) => {
    setDailyProgress(prev => {
      const isCompleted = prev.includes(index);
      const newProgress = isCompleted ? prev.filter(i => i !== index) : [...prev, index];
      localStorage.setItem('gympal_daily_progress', JSON.stringify({
        date: todayStr,
        progress: newProgress
      }));
      return newProgress;
    });
  };

  const addPunishment = (punishmentText) => {
    setPunishments(prev => {
      const newList = [...prev, punishmentText];
      localStorage.setItem('gympal_punishments', JSON.stringify({
        date: todayStr,
        list: newList
      }));
      return newList;
    });
  };
  
  const resetProgress = () => {
    localStorage.removeItem('gympal_start_date');
    localStorage.removeItem('gympal_history');
    localStorage.removeItem('gympal_daily_progress');
    localStorage.removeItem('gympal_punishments');
    setHistory([]);
    setDailyProgress([]);
    setPunishments([]);
    getStartDate(); // Generates new start date synchronously
  };

  return {
    currentDay,
    streak,
    history,
    isTodayCompleted,
    dailyProgress,
    punishments,
    markWorkoutComplete,
    toggleExercise,
    addPunishment,
    resetProgress
  };
};
