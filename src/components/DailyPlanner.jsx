import { useState, useEffect, useRef } from 'react'
import { Plus, Minus, Flame, ChevronRight, Dumbbell, Droplet, Moon, UtensilsCrossed, Beef, Target, BookOpen, Monitor, ClipboardList, TrendingUp, Settings, X, AlertTriangle, Sparkles, Trophy } from 'lucide-react'
import { useHabits } from '../hooks/useHabits'
import { awardHabitXP } from '../hooks/useSkills'

const COLOR_MAP = {
  emerald: {
    ring: 'from-emerald-500 to-emerald-300',
    bar: 'bg-emerald-500',
    barTrack: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
  blue: {
    ring: 'from-blue-500 to-blue-300',
    bar: 'bg-blue-500',
    barTrack: 'bg-blue-500/20',
    text: 'text-blue-400',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
  purple: {
    ring: 'from-purple-500 to-purple-300',
    bar: 'bg-purple-500',
    barTrack: 'bg-purple-500/20',
    text: 'text-purple-400',
    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.3)]',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  amber: {
    ring: 'from-amber-500 to-amber-300',
    bar: 'bg-amber-500',
    barTrack: 'bg-amber-500/20',
    text: 'text-amber-400',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
  cyan: {
    ring: 'from-cyan-500 to-cyan-300',
    bar: 'bg-cyan-500',
    barTrack: 'bg-cyan-500/20',
    text: 'text-cyan-400',
    glow: 'shadow-[0_0_12px_rgba(6,182,212,0.3)]',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
  },
  rose: {
    ring: 'from-rose-500 to-rose-300',
    bar: 'bg-rose-500',
    barTrack: 'bg-rose-500/20',
    text: 'text-rose-400',
    glow: 'shadow-[0_0_12px_rgba(244,63,94,0.3)]',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
  },
  violet: {
    ring: 'from-violet-500 to-violet-300',
    bar: 'bg-violet-500',
    barTrack: 'bg-violet-500/20',
    text: 'text-violet-400',
    glow: 'shadow-[0_0_12px_rgba(139,92,246,0.3)]',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
  },
  indigo: {
    ring: 'from-indigo-500 to-indigo-300',
    bar: 'bg-indigo-500',
    barTrack: 'bg-indigo-500/20',
    text: 'text-indigo-400',
    glow: 'shadow-[0_0_12px_rgba(99,102,241,0.3)]',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
  },
  pink: {
    ring: 'from-pink-500 to-pink-300',
    bar: 'bg-pink-500',
    barTrack: 'bg-pink-500/20',
    text: 'text-pink-400',
    glow: 'shadow-[0_0_12px_rgba(236,72,153,0.3)]',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
  },
}

const COLORS = ['emerald', 'blue', 'purple', 'amber', 'cyan', 'rose', 'violet', 'indigo', 'pink']

const ICON_MAP = {
  protein: Beef,
  water: Droplet,
  sleep: Moon,
  meals: UtensilsCrossed,
  stretch: Dumbbell,
  focus: Target,
  reading: BookOpen,
  coding: Monitor,
  planning: ClipboardList,
}

// ── XP Toast ───────────────────────────────────
const XPToast = ({ xpAmount, skill, onComplete }) => {
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  useEffect(() => {
    const timer = setTimeout(() => onCompleteRef.current(), 2500)
    return () => clearTimeout(timer)
  }, []) // empty deps — timer only starts on mount, never resets

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-gradient-to-r from-emerald-900/90 to-black border border-emerald-500/30 rounded-2xl px-5 py-3 shadow-[0_0_30px_rgba(16,185,129,0.2)] backdrop-blur-xl flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
          <Trophy size={16} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">+{xpAmount} XP</p>
          <p className="text-[10px] text-emerald-400/80">{skill}</p>
        </div>
      </div>
    </div>
  )
}

// ── Completion Ring ─────────────────────────────
const CompletionRing = ({ percent, size = 80 }) => {
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-zinc-800" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="url(#ring-gradient)" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-700 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-extrabold text-white">{percent}%</span>
        <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Done</span>
      </div>
    </div>
  )
}

// ── Habit Card ─────────────────────────────────
const HabitCard = ({ habit, value, streak, colors, onIncrement, onDecrement, onSetValue, onRemove }) => {
  const Icon = ICON_MAP[habit.id]
  const percent = Math.min(100, Math.round((value / habit.target) * 100))
  const isComplete = value >= habit.target
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(String(value))
  const inputRef = useRef(null)
  const isLargeTarget = habit.target > 10

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const commitEdit = () => {
    setEditing(false)
    const parsed = Number.parseInt(editText, 10)
    if (!Number.isNaN(parsed) && parsed >= 0 && parsed !== value && onSetValue) {
      onSetValue(parsed)
    }
  }

  const quickAdd = (amount) => {
    if (onSetValue) {
      const next = Math.min(value + amount, habit.target)
      onSetValue(next)
    }
  }

  const fillToTarget = () => {
    if (onSetValue) {
      onSetValue(habit.target)
    }
  }

  const presetButtons = !isComplete && isLargeTarget && [
    ...(habit.target >= 100 ? [{ label: '+10', amount: 10 }, { label: '+25', amount: 25 }] : [{ label: '+5', amount: 5 }, { label: '+10', amount: 10 }]),
    ...(habit.target - value > habit.target * 0.3 ? [{ label: `Fill → ${habit.target}`, amount: 'fill' }] : []),
  ]

  return (
    <div className={`relative rounded-2xl border p-4 transition-all duration-300 ${isComplete ? `${colors.bg} ${colors.border} ${colors.glow}` : 'bg-zinc-900/80 border-zinc-800/80 backdrop-blur-sm'}`}>
      {/* Gradient border accent */}
      <div className={`absolute inset-0 rounded-2xl p-px bg-gradient-to-b ${isComplete ? `${colors.ring}/30` : 'from-white/5'} via-transparent to-transparent pointer-events-none [mask:linear-gradient(#fff,#fff)_content-box,linear-gradient(#fff,#fff)] [mask-composite:exclude]`} />

      <div className="flex items-center justify-between mb-3 relative">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-colors ${isComplete ? `${colors.bg} ${colors.border}` : 'bg-zinc-800/80 border border-zinc-700/50'}`}>
            {Icon ? <Icon size={20} className={isComplete ? colors.text : 'text-zinc-400'} /> : habit.icon}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{habit.name}</h4>
            <p className="text-xs text-zinc-500">{habit.target} {habit.unit} goal</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/30 px-2 py-1 rounded-full">
              <Flame size={12} className="text-orange-500" />
              <span className="text-xs font-bold text-orange-400">{streak}</span>
            </div>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${habit.name}`}
              className="w-7 h-7 rounded-full bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center text-zinc-500 hover:text-red-400 hover:border-red-500/30 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 relative">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onDecrement} aria-label={`Decrease ${habit.name}`} className="w-9 h-9 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all duration-200">
            <Minus size={14} />
          </button>

          {/* Editable value — click to type */}
          {editing ? (
            <input
              ref={inputRef}
              type="number"
              min="0"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') { setEditing(false); setEditText(String(value)); } }}
              className="w-20 text-lg font-extrabold bg-zinc-800 border border-zinc-600 rounded-lg px-2 py-1 text-white text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
            />
          ) : (
            <button
              type="button"
              onClick={() => { setEditing(true); setEditText(String(value)) }}
              aria-label="Edit habit value"
              className="text-lg font-extrabold text-white min-w-[3.5rem] text-center hover:text-emerald-400 transition-colors cursor-text"
            >
              {value} <span className="text-xs font-normal text-zinc-500">/ {habit.target}</span>
            </button>
          )}

          <button type="button" onClick={onIncrement} aria-label={`Increase ${habit.name}`} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${isComplete ? `${colors.bg} ${colors.border} ${colors.text}` : 'bg-zinc-800/80 border border-zinc-700/50 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}>
            <Plus size={14} />
          </button>
        </div>
        <span className="text-xs font-bold text-zinc-500">{percent}%</span>
      </div>

      {/* Quick-add preset buttons for large targets */}
      {presetButtons && presetButtons.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {presetButtons.map((btn) => (
            <button
              key={btn.label}
              type="button"
              onClick={() => btn.amount === 'fill' ? fillToTarget() : quickAdd(btn.amount)}
              className="px-2.5 py-1 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-xs font-semibold text-zinc-400 hover:text-white hover:border-zinc-500 transition-all active:scale-95"
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      <div className={`h-1.5 w-full rounded-full overflow-hidden ${colors.barTrack}`}>
        <div className={`h-full rounded-full transition-all duration-500 ease-out ${colors.bar} ${isComplete ? colors.glow : ''}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

// ── Manage Habits Modal ─────────────────────────
const ManageHabitsModal = ({ habits, onClose, onAdd, onRemove }) => {
  const [newName, setNewName] = useState('')
  const [newTarget, setNewTarget] = useState('')
  const [newUnit, setNewUnit] = useState('')
  const [newColor, setNewColor] = useState('emerald')
  const [newCategory, setNewCategory] = useState('health')
  const [error, setError] = useState('')

  const handleAdd = () => {
    if (!newName.trim()) { setError('Name is required'); return }
    if (!newTarget || Number(newTarget) <= 0) { setError('Target must be a positive number'); return }
    if (!newUnit.trim()) { setError('Unit is required'); return }

    const id = `custom_${Date.now()}_${newName.trim().toLowerCase().replace(/\s+/g, '_')}`
    onAdd({
      id,
      name: newName.trim(),
      icon: '📌',
      target: Number(newTarget),
      unit: newUnit.trim(),
      frequency: 'daily',
      color: newColor,
      category: newCategory,
    })
    setNewName('')
    setNewTarget('')
    setNewUnit('')
    setNewColor('emerald')
    setNewCategory('health')
    setError('')
  }

  const healthHabits = habits.filter(h => h.category === 'health')
  const workHabits = habits.filter(h => h.category === 'work')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div role="dialog" aria-modal="true" aria-labelledby="manage-habits-title" className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-5 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 id="manage-habits-title" className="text-lg font-bold text-white flex items-center gap-2">
            <Settings size={18} className="text-zinc-400" />
            Manage Habits
          </h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* ── Existing Habits ── */}
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Health Habits</h3>
            {healthHabits.length === 0 ? (
              <p className="text-sm text-zinc-600">No health habits added yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {healthHabits.map(h => (
                  <div key={h.id} className="flex items-center gap-2 bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-3 py-2 group">
                    <span className={`w-2 h-2 rounded-full ${COLOR_MAP[h.color]?.bar || 'bg-zinc-500'}`} />
                    <span className="text-sm text-zinc-300">{h.name}</span>
                    <span className="text-xs text-zinc-600">{h.target} {h.unit}</span>
                    <button type="button" onClick={() => onRemove(h.id)} aria-label={`Remove ${h.name}`} className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Work Habits</h3>
            {workHabits.length === 0 ? (
              <p className="text-sm text-zinc-600">No work habits added yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {workHabits.map(h => (
                  <div key={h.id} className="flex items-center gap-2 bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-3 py-2 group">
                    <span className={`w-2 h-2 rounded-full ${COLOR_MAP[h.color]?.bar || 'bg-zinc-500'}`} />
                    <span className="text-sm text-zinc-300">{h.name}</span>
                    <span className="text-xs text-zinc-600">{h.target} {h.unit}</span>
                    <button type="button" onClick={() => onRemove(h.id)} aria-label={`Remove ${h.name}`} className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div className="border-t border-zinc-800" />

          {/* ── Add New Habit Form ── */}
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Add New Habit</h3>

            {error && (
              <div className="mb-3 flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                <AlertTriangle size={12} />
                {error}
              </div>
            )}

            <div className="space-y-3">
              {/* Name */}
              <div>
                <label htmlFor="habit-name" className="text-xs text-zinc-500 mb-1 block">Name</label>
                <input id="habit-name" type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Meditation" className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
              </div>

              {/* Target & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="habit-target" className="text-xs text-zinc-500 mb-1 block">Target</label>
                  <input id="habit-target" type="number" step="any" value={newTarget} onChange={e => setNewTarget(e.target.value)} placeholder="e.g. 30" className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                </div>
                <div>
                  <label htmlFor="habit-unit" className="text-xs text-zinc-500 mb-1 block">Unit</label>
                  <input id="habit-unit" type="text" value={newUnit} onChange={e => setNewUnit(e.target.value)} placeholder="e.g. minutes" className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Category</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setNewCategory('health')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${newCategory === 'health' ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-zinc-800/60 border border-zinc-700/50 text-zinc-500 hover:text-zinc-300'}`}>
                    Health
                  </button>
                  <button type="button" onClick={() => setNewCategory('work')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${newCategory === 'work' ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400' : 'bg-zinc-800/60 border border-zinc-700/50 text-zinc-500 hover:text-zinc-300'}`}>
                    Work
                  </button>
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setNewColor(c)} className={`w-7 h-7 rounded-full transition-all ${c === newColor ? 'ring-2 ring-white ring-offset-1 ring-offset-zinc-900 scale-110' : ''} ${COLOR_MAP[c]?.bar.replace('bg-', 'bg-').replace('-500', '-500/80') || 'bg-zinc-600'}`} aria-label={`Color ${c}`} />
                  ))}
                </div>
              </div>

              <button type="button" onClick={handleAdd} className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 transition-all duration-200 flex items-center justify-center gap-2">
                <Plus size={16} />
                Add Habit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Habit Section ──────────────────────────────
const HabitSection = ({ title, subtitle, icon: SectionIcon, habits, todayLogs, getHabitStreak, incrementHabit, decrementHabit, setHabitValue, onRemove }) => {
  const completedCount = habits.filter((h) => (todayLogs[h.id] || 0) >= h.target).length

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-800/80 border border-zinc-700/50">
            {SectionIcon && <SectionIcon size={16} className="text-zinc-300" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
            <p className="text-[10px] text-zinc-500">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-white">{completedCount}</span>
          <span className="text-xs text-zinc-500">/ {habits.length}</span>
          <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden ml-2">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500" style={{ width: `${habits.length > 0 ? (completedCount / habits.length) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {habits.map((habit) => {
          const colors = COLOR_MAP[habit.color] || COLOR_MAP.blue
          const value = todayLogs[habit.id] || 0
          const streak = getHabitStreak(habit.id)

          return (
            <div key={habit.id} className="group">
              <HabitCard
                habit={habit}
                value={value}
                streak={streak}
                colors={colors}
                onIncrement={() => incrementHabit(habit.id)}
                onDecrement={() => decrementHabit(habit.id)}
                onSetValue={setHabitValue ? (v) => setHabitValue(habit.id, v) : null}
                onRemove={habit.id.startsWith('custom_') ? () => onRemove(habit.id) : null}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main DailyPlanner ──────────────────────────
const DailyPlanner = () => {
  const {
    habits,
    todayLogs,
    incrementHabit,
    decrementHabit,
    setHabitValue,
    getHabitStreak,
    getCompletionPercent,
    addCustomHabit,
    removeHabit,
    storageError,
  } = useHabits()

  const [showManage, setShowManage] = useState(false)
  const [xpToast, setXpToast] = useState(null)
  const [prevCompleted, setPrevCompleted] = useState({})

  const completionPercent = getCompletionPercent()
  const allCompletedCount = habits.filter((h) => (todayLogs[h.id] || 0) >= h.target).length
  const allDone = allCompletedCount === habits.length && habits.length > 0

  const healthHabits = habits.filter((h) => h.category === 'health')
  const workHabits = habits.filter((h) => h.category === 'work')

  // ── XP Award Logic ──
  // Track which habits were already completed to detect new completions
  useEffect(() => {
    habits.forEach((habit) => {
      const currentValue = todayLogs[habit.id] || 0
      const wasCompleted = prevCompleted[habit.id] || false
      const nowCompleted = currentValue >= habit.target

      if (nowCompleted && !wasCompleted) {
        // Habit just got completed — award XP!
        const allHabitsCompleted = habits.every(h => (todayLogs[h.id] || 0) >= h.target)
        const result = awardHabitXP(habit.category, allHabitsCompleted)
        setXpToast({ id: Date.now(), xpAmount: result.xpAmount, skill: `Discipline Lv.${result.level}` })
      }

      setPrevCompleted(p => ({ ...p, [habit.id]: nowCompleted }))
    })
  }, [todayLogs, habits, prevCompleted])

  // ── Full completion bonus ──
  const prevAllDoneRef = useRef(false)
  useEffect(() => {
    if (allDone && !prevAllDoneRef.current) {
      // Already handled per-habit, so don't double-award
    }
    prevAllDoneRef.current = allDone
  }, [allDone])

  return (
    <div className="max-w-lg mx-auto relative">
      {/* XP Toast */}
      {xpToast && (
        <XPToast
          key={xpToast.id}
          xpAmount={xpToast.xpAmount}
          skill={xpToast.skill}
          onComplete={() => setXpToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp size={22} className="text-emerald-400" />
            Daily Habits
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowManage(true)}
            aria-label="Manage habits"
            className="w-9 h-9 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
          >
            <Settings size={16} />
          </button>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-lg font-extrabold text-white">{allCompletedCount}</span>
              <span className="text-sm text-zinc-500">/{habits.length}</span>
            </div>
            <CompletionRing percent={completionPercent} size={72} />
          </div>
        </div>
      </div>

      {/* All Complete Celebration */}
      {allDone && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Sparkles size={20} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-400">All habits complete!</p>
            <p className="text-xs text-emerald-400/60">Bonus XP awarded for full completion.</p>
          </div>
        </div>
      )}

      {/* Health Habits Section */}
      {healthHabits.length > 0 && (
        <HabitSection
          title="Health"
          subtitle="Body & recovery"
          icon={Dumbbell}
          habits={healthHabits}
          todayLogs={todayLogs}
          getHabitStreak={getHabitStreak}
          incrementHabit={incrementHabit}
          decrementHabit={decrementHabit}
          setHabitValue={setHabitValue}
          onRemove={removeHabit}
        />
      )}

      {/* Work Habits Section */}
      {workHabits.length > 0 && (
        <HabitSection
          title="Work"
          subtitle="Focus & growth"
          icon={Target}
          habits={workHabits}
          todayLogs={todayLogs}
          getHabitStreak={getHabitStreak}
          incrementHabit={incrementHabit}
          decrementHabit={decrementHabit}
          setHabitValue={setHabitValue}
          onRemove={removeHabit}
        />
      )}

      {/* Summary */}
      <div className="relative p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-sm">
        <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent pointer-events-none [mask:linear-gradient(#fff,#fff)_content-box,linear-gradient(#fff,#fff)] [mask-composite:exclude]" />
        <div className="flex items-center gap-2 mb-4 relative">
          <ChevronRight size={16} className="text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Today's Summary</h3>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center relative">
          <div>
            <span className="text-2xl font-extrabold text-white">{allCompletedCount}</span>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Completed</p>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white">{habits.length - allCompletedCount}</span>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Remaining</p>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white">{completionPercent}%</span>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Progress</p>
          </div>
        </div>
        <div className="mt-4 h-2 w-full bg-zinc-800 rounded-full overflow-hidden relative">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-700" style={{ width: `${completionPercent}%` }} />
        </div>
        {completionPercent === 100 && (
          <p className="text-center text-xs font-bold text-emerald-400 mt-3">All habits completed! Discipline skill gained.</p>
        )}
      </div>

      {/* Storage Error */}
      {storageError && (
        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
          {storageError}
        </div>
      )}

      {/* Manage Habits Modal */}
      {showManage && (
        <ManageHabitsModal
          habits={habits}
          onClose={() => setShowManage(false)}
          onAdd={addCustomHabit}
          onRemove={removeHabit}
        />
      )}
    </div>
  )
}

export default DailyPlanner
