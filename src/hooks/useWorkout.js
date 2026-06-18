import { useState } from 'react';
import { safeLocalStorage, toDateKey } from '../utils/storage';

// Start date: Let's assume today is Day 1
const getStartDate = (onStorageError) => {
  const storedDate = safeLocalStorage.get('gympal_start_date', onStorageError);
  if (storedDate) {
    return new Date(storedDate);
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  safeLocalStorage.set('gympal_start_date', today.toISOString(), onStorageError);
  return today;
};

// Hook to manage streak, days and workout status
export const useWorkout = () => {
  const [storageError, setStorageError] = useState(null);
  const handleStorageError = (error) => {
    console.warn('LocalStorage error', error);
    setStorageError('Local storage is unavailable. Data will not persist on this device.');
  };

  const [history, setHistory] = useState(() => (
    safeLocalStorage.getJSON('gympal_history', [], Array.isArray, handleStorageError)
  ));

  // Derived state (no useEffect needed)
  const startDate = getStartDate(handleStorageError);
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
  const todayStr = toDateKey(today);
  const isTodayCompleted = history.includes(todayStr);

  // Calculate streak (consecutive weekdays)
  let streak = 0;
  let checkDate = new Date(today); // Local time checkDate
  
  while(true) {
    if (checkDate > today) break;

    const dateStr = toDateKey(checkDate);
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
    // Ensure we only load progress for *today*
    const stored = safeLocalStorage.getJSON(
      'gympal_daily_progress',
      null,
      (value) => value && typeof value === 'object' && Array.isArray(value.progress) && typeof value.date === 'string',
      handleStorageError
    );
    if (stored) {
      const todayStr = toDateKey(new Date());
      if (stored.date === todayStr) return stored.progress;
    }
    return [];
  });

  // Track extra punishment exercises added today (array of strings)
  const [punishments, setPunishments] = useState(() => {
    const stored = safeLocalStorage.getJSON(
      'gympal_punishments',
      null,
      (value) => value && typeof value === 'object' && Array.isArray(value.list) && typeof value.date === 'string',
      handleStorageError
    );
    if (stored) {
      const todayStr = toDateKey(new Date());
      if (stored.date === todayStr) return stored.list;
    }
    return [];
  });

  // 70kg Final Cut: Protein Goal Streak
  const [proteinStreak, setProteinStreak] = useState(() => {
    const stored = safeLocalStorage.get('gympal_protein_streak', handleStorageError);
    return stored ? Number.parseInt(stored, 10) : 0;
  });

  const [lastProteinDate, setLastProteinDate] = useState(() => (
    safeLocalStorage.get('gympal_last_protein_date', handleStorageError) || null
  ));

  // 70kg Final Cut: Weekly Weight Tracker
  const [weightLogs, setWeightLogs] = useState(() => (
    safeLocalStorage.getJSON('gympal_weight_logs', [], Array.isArray, handleStorageError)
  ));

  // Jog history for post-run analytics and charts
  const [jogLogs, setJogLogs] = useState(() => (
    safeLocalStorage.getJSON('gympal_jog_logs', [], Array.isArray, handleStorageError)
  ));

  const [exerciseLogs, setExerciseLogs] = useState(() => (
    safeLocalStorage.getJSON('gympal_exercise_logs', {}, (v) => typeof v === 'object' && v !== null, handleStorageError)
  ));

  const todayExerciseLogs = exerciseLogs[todayStr] || [];

  const markWorkoutComplete = () => {
    if (!history.includes(todayStr)) {
      const newHistory = [...history, todayStr];
      setHistory(newHistory);
      safeLocalStorage.setJSON('gympal_history', newHistory, handleStorageError);
    }
  };
  
  const toggleExercise = (index) => {
    setDailyProgress(prev => {
      const isCompleted = prev.includes(index);
      const newProgress = isCompleted ? prev.filter(i => i !== index) : [...prev, index];
      safeLocalStorage.setJSON('gympal_daily_progress', {
        date: todayStr,
        progress: newProgress
      }, handleStorageError);
      return newProgress;
    });
  };

  const addPunishment = (punishmentText) => {
    setPunishments(prev => {
      const newList = [...prev, punishmentText];
      safeLocalStorage.setJSON('gympal_punishments', {
        date: todayStr,
        list: newList
      }, handleStorageError);
      return newList;
    });
  };

  const logProteinGoal = () => {
    if (lastProteinDate === todayStr) return; // Already logged today

    let newStreak = 1;

    if (lastProteinDate) {
      const lastDate = new Date(lastProteinDate);
      const current = new Date(todayStr); // using normalized strings
      const diffTime = Math.abs(current - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak = proteinStreak + 1;
      }
    }

    setProteinStreak(newStreak);
    setLastProteinDate(todayStr);
    safeLocalStorage.set('gympal_protein_streak', String(newStreak), handleStorageError);
    safeLocalStorage.set('gympal_last_protein_date', todayStr, handleStorageError);
  };

  const addWeightLog = (weight) => {
    const newLog = { date: todayStr, weight: parseFloat(weight) };
    // Check if we already logged today and update if so
    setWeightLogs(prev => {
      const existingIndex = prev.findIndex(log => log.date === todayStr);
      let updatedLogs;
      if (existingIndex >= 0) {
        updatedLogs = [...prev];
        updatedLogs[existingIndex] = newLog;
      } else {
        updatedLogs = [...prev, newLog];
      }
      safeLocalStorage.setJSON('gympal_weight_logs', updatedLogs, handleStorageError);
      return updatedLogs;
    });
  };

  const addJogLog = (distanceKm) => {
    const parsedDistance = Number.parseFloat(distanceKm);
    if (Number.isNaN(parsedDistance) || parsedDistance < 0) return;

    const roundedDistance = Math.round(parsedDistance * 10) / 10;

    setJogLogs(prev => {
      const existingIndex = prev.findIndex(log => log.date === todayStr);
      let updatedLogs;

      if (existingIndex >= 0) {
        updatedLogs = [...prev];
        updatedLogs[existingIndex] = {
          ...updatedLogs[existingIndex],
          distanceKm: roundedDistance
        };
      } else {
        updatedLogs = [...prev, { date: todayStr, distanceKm: roundedDistance }];
      }

      safeLocalStorage.setJSON('gympal_jog_logs', updatedLogs, handleStorageError);
      return updatedLogs;
    });
  };

  const logExerciseSet = (exerciseIndex, setIndex, weight, reps) => {
    setExerciseLogs(prev => {
      const dayLogs = [...(prev[todayStr] || [])];
      const exerciseEntry = dayLogs.find(e => e.exerciseIndex === exerciseIndex)
      if (exerciseEntry) {
        exerciseEntry.sets = [...exerciseEntry.sets];
        exerciseEntry.sets[setIndex] = { weight: Number(weight) || 0, reps: Number(reps) || 0 };
      } else {
        dayLogs.push({
          exerciseIndex,
          sets: [{ weight: Number(weight) || 0, reps: Number(reps) || 0 }]
        });
      }
      const updated = { ...prev, [todayStr]: dayLogs };
      safeLocalStorage.setJSON('gympal_exercise_logs', updated, handleStorageError);
      return updated;
    });
  };

  const addExerciseSet = (exerciseIndex) => {
    setExerciseLogs(prev => {
      const dayLogs = [...(prev[todayStr] || [])];
      const exerciseEntry = dayLogs.find(e => e.exerciseIndex === exerciseIndex);
      if (exerciseEntry) {
        const lastSet = exerciseEntry.sets[exerciseEntry.sets.length - 1] || { weight: 0, reps: 10 };
        exerciseEntry.sets = [...exerciseEntry.sets, { ...lastSet }];
      } else {
        dayLogs.push({ exerciseIndex, sets: [{ weight: 0, reps: 10 }] });
      }
      const updated = { ...prev, [todayStr]: dayLogs };
      safeLocalStorage.setJSON('gympal_exercise_logs', updated, handleStorageError);
      return updated;
    });
  };

  const removeExerciseSet = (exerciseIndex, setIndex) => {
    setExerciseLogs(prev => {
      const dayLogs = [...(prev[todayStr] || [])];
      const exerciseEntry = dayLogs.find(e => e.exerciseIndex === exerciseIndex);
      if (exerciseEntry && exerciseEntry.sets.length > 1) {
        exerciseEntry.sets = exerciseEntry.sets.filter((_, i) => i !== setIndex);
      }
      const updated = { ...prev, [todayStr]: dayLogs };
      safeLocalStorage.setJSON('gympal_exercise_logs', updated, handleStorageError);
      return updated;
    });
  };

  const getExerciseHistory = () => {
    const results = [];
    for (const [date, logs] of Object.entries(exerciseLogs)) {
      for (const log of logs) {
        results.push({ date, sets: log.sets });
      }
    }
    return results.sort((a, b) => a.date.localeCompare(b.date));
  };

  const getExerciseWeeklyVolume = (exerciseIndex) => {
    const now = new Date()
    let totalVolume = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = toDateKey(d)
      const dayLogs = exerciseLogs[key] || []
      for (const log of dayLogs) {
        if (log.exerciseIndex === exerciseIndex) {
          for (const set of log.sets) {
            totalVolume += (set.weight || 0) * (set.reps || 0)
          }
        }
      }
    }
    return totalVolume
  }

  const getPR = (exerciseIndex) => {
    let maxWeight = 0;
    let maxVolume = 0;
    let bestSet = null;
    for (const [date, logs] of Object.entries(exerciseLogs)) {
      for (const log of logs) {
        if (log.exerciseIndex === exerciseIndex) {
          for (const set of log.sets) {
            if (set.weight > maxWeight) {
              maxWeight = set.weight;
              bestSet = { ...set, date };
            }
            const vol = set.weight * set.reps;
            if (vol > maxVolume) maxVolume = vol;
          }
        }
      }
    }
    return { maxWeight, maxVolume, bestSet };
  };

  const clearTodayProgress = () => {
    setDailyProgress([]);
    safeLocalStorage.setJSON('gympal_daily_progress', {
      date: todayStr,
      progress: []
    }, handleStorageError);
  };
  
  const resetProgress = () => {
    safeLocalStorage.remove('gympal_start_date', handleStorageError);
    safeLocalStorage.remove('gympal_history', handleStorageError);
    safeLocalStorage.remove('gympal_daily_progress', handleStorageError);
    safeLocalStorage.remove('gympal_punishments', handleStorageError);
    safeLocalStorage.remove('gympal_jog_logs', handleStorageError);
    safeLocalStorage.remove('gympal_weight_logs', handleStorageError);
    safeLocalStorage.remove('gympal_exercise_logs', handleStorageError);
    safeLocalStorage.remove('gympal_protein_streak', handleStorageError);
    safeLocalStorage.remove('gympal_last_protein_date', handleStorageError);
    setHistory([]);
    setDailyProgress([]);
    setPunishments([]);
    setJogLogs([]);
    setWeightLogs([]);
    setExerciseLogs({});
    setProteinStreak(0);
    setLastProteinDate(null);
    getStartDate(handleStorageError); // Generates new start date synchronously
  };

  return {
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
    markWorkoutComplete,
    toggleExercise,
    addPunishment,
    logProteinGoal,
    addWeightLog,
    addJogLog,
    logExerciseSet,
    addExerciseSet,
    removeExerciseSet,
    getExerciseHistory,
    getPR,
    getExerciseWeeklyVolume,
    clearTodayProgress,
    resetProgress,
    storageError
  };
};
