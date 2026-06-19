import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { safeLocalStorage, toDateKey } from '../utils/storage'
import { DEFAULT_HABITS } from '../data/defaultHabits'

const STORAGE_KEY = 'gympal_habits'
const MAX_STREAK_DAYS = 730 // 2-year safety guard

const loadState = (onError) => {
  return safeLocalStorage.getJSON(
    STORAGE_KEY,
    { habits: DEFAULT_HABITS, logs: {} },
    (v) => v && typeof v === 'object' && Array.isArray(v.habits) && typeof v.logs === 'object',
    onError
  )
}

const isCompleted = (value, target) => {
  return value >= target
}

export const useHabits = () => {
  const [storageError, setStorageError] = useState(null)
  const handleStorageError = (error) => {
    console.warn('LocalStorage error', error)
    setStorageError('Local storage is unavailable. Habit data will not persist.')
  }

  const [state, setState] = useState(() => loadState(handleStorageError))
  const { habits, logs } = state

  // Reactive todayKey — recalculates at midnight to avoid stale-day bug
  const [now, setNow] = useState(() => new Date())
  const midnightTimerRef = useRef(null)

  useEffect(() => {
    const msUntilMidnight = new Date(
      now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0
    ) - now;
    midnightTimerRef.current = setTimeout(() => {
      setNow(new Date());
    }, msUntilMidnight + 1000); // 1s after midnight
    return () => clearTimeout(midnightTimerRef.current);
  }, [now])

  const todayKey = useMemo(() => toDateKey(now), [now])
  const todayLogs = useMemo(() => logs[todayKey] || {}, [logs, todayKey])

  const persist = useCallback((nextState) => {
    setState(prev => {
      const newState = typeof nextState === 'function' ? nextState(prev) : nextState;
      safeLocalStorage.setJSON(STORAGE_KEY, newState, handleStorageError);
      return newState;
    });
  }, [])

  const logHabit = useCallback((habitId, value) => {
    persist((prev) => ({
      ...prev,
      logs: {
        ...prev.logs,
        [todayKey]: {
          ...prev.logs[todayKey],
          [habitId]: value,
        },
      },
    }))
  }, [todayKey, persist])

  const incrementHabit = useCallback((habitId) => {
    persist((prev) => {
      const current = prev.logs[todayKey]?.[habitId] || 0
      return {
        ...prev,
        logs: {
          ...prev.logs,
          [todayKey]: {
            ...prev.logs[todayKey],
            [habitId]: current + 1,
          },
        },
      }
    })
  }, [todayKey, persist])

  const decrementHabit = useCallback((habitId) => {
    persist((prev) => {
      const current = prev.logs[todayKey]?.[habitId] || 0
      return {
        ...prev,
        logs: {
          ...prev.logs,
          [todayKey]: {
            ...prev.logs[todayKey],
            [habitId]: Math.max(0, current - 1),
          },
        },
      }
    })
  }, [todayKey, persist])

  const setHabitValue = useCallback((habitId, value) => {
    persist((prev) => ({
      ...prev,
      logs: {
        ...prev.logs,
        [todayKey]: {
          ...prev.logs[todayKey],
          [habitId]: Math.max(0, value),
        },
      },
    }))
  }, [todayKey, persist])

  const getHabitStreak = useCallback((habitId) => {
    const habit = habits.find((h) => h.id === habitId)
    if (!habit) return 0

    let streak = 0
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    let guard = 0

    while (guard < MAX_STREAK_DAYS) {
      guard++
      const key = toDateKey(date)
      const value = logs[key]?.[habitId] || 0

      if (isCompleted(value, habit.target)) {
        streak++
      } else if (key !== todayKey) {
        break
      }

      if (key === todayKey && !isCompleted(value, habit.target)) {
        break
      }

      date.setDate(date.getDate() - 1)
    }

    return streak
  }, [habits, logs, todayKey])

  const getCompletionPercent = useCallback(() => {
    if (habits.length === 0) return 0
    const completedCount = habits.filter((h) => {
      const value = todayLogs[h.id] || 0
      return isCompleted(value, h.target)
    }).length
    return Math.round((completedCount / habits.length) * 100)
  }, [habits, todayLogs])

  const addCustomHabit = useCallback((habit) => {
    persist((prev) => ({
      ...prev,
      habits: [...prev.habits, habit],
    }))
  }, [persist])

  const removeHabit = useCallback((habitId) => {
    persist((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== habitId),
    }))
  }, [persist])

  return {
    habits,
    todayLogs,
    logHabit,
    incrementHabit,
    decrementHabit,
    setHabitValue,
    getHabitStreak,
    getCompletionPercent,
    addCustomHabit,
    removeHabit,
    storageError,
  }
}
