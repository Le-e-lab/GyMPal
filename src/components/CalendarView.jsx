import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { toDateKey } from '../utils/storage'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

const CalendarView = ({ history, exerciseLogs, currentStreak }) => {
  const [viewDate, setViewDate] = useState(() => new Date())

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const todayKey = toDateKey(new Date())

  const monthStats = useMemo(() => {
    let workedOut = 0
    let totalExercises = 0
    for (let d = 1; d <= daysInMonth; d++) {
      const key = toDateKey(new Date(year, month, d))
      if (history.includes(key)) {
        workedOut++
      }
      const logs = exerciseLogs[key]
      if (logs) {
        totalExercises += logs.length
      }
    }
    return { workedOut, totalExercises }
  }, [year, month, daysInMonth, history, exerciseLogs])

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const cells = []
  for (let i = 0; i < firstDay; i++) {
    cells.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d)
  }

  return (
    <div className="mb-10 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
      <div className="flex items-center gap-2 mb-6">
        <Calendar size={18} className="text-purple-400" />
        <h3 className="text-lg font-bold text-white">Workout Calendar</h3>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-bold text-white">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-[10px] font-bold text-zinc-500 uppercase tracking-wider py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="aspect-square" />
          }

          const key = toDateKey(new Date(year, month, day))
          const isHistory = history.includes(key)
          const hasLogs = exerciseLogs[key] && exerciseLogs[key].length > 0
          const isToday = key === todayKey

          let dotColor = ''
          if (isHistory) {
            dotColor = 'bg-emerald-500'
          } else if (hasLogs) {
            dotColor = 'bg-yellow-500'
          }

          return (
            <div
              key={key}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-medium relative ${
                isToday ? 'ring-2 ring-purple-500 ring-offset-1 ring-offset-zinc-900' : ''
              }`}
            >
              <span className={`${isToday ? 'text-white font-bold' : isHistory ? 'text-emerald-400' : 'text-zinc-400'}`}>
                {day}
              </span>
              {dotColor && (
                <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${dotColor}`} />
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="text-center">
          <span className="text-2xl font-extrabold text-white">{monthStats.workedOut}</span>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">Days Active</p>
        </div>
        <div className="text-center">
          <span className="text-2xl font-extrabold text-white">{currentStreak}</span>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">Streak</p>
        </div>
        <div className="text-center">
          <span className="text-2xl font-extrabold text-white">{monthStats.totalExercises}</span>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">Exercises</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-[10px] text-zinc-500">Partial</span>
        </div>
      </div>
    </div>
  )
}

export default CalendarView
