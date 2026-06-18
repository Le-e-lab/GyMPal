import React, { useMemo } from 'react'
import { toDateKey } from '../utils/storage'

const MUSCLE_GROUPS = [
  { name: 'Chest', keywords: ['bench', 'fly', 'incline', 'push-up', 'pushup', 'chest', 'floor press'] },
  { name: 'Back', keywords: ['row', 'pull', 'pullover', 'back', 'lat'] },
  { name: 'Shoulders', keywords: ['press', 'shoulder', 'lateral', 'front raise', 'pike', 'overhead'] },
  { name: 'Arms', keywords: ['curl', 'hammer', 'tricep', 'extension', 'kickback', 'bicep', 'dips'] },
  { name: 'Legs', keywords: ['squat', 'lunge', 'step', 'leg', 'goblet', 'calf', 'wall sit'] },
  { name: 'Hamstrings', keywords: ['rdl', 'deadlift', 'hamstring', 'good morning'] },
  { name: 'Core', keywords: ['plank', 'crunch', 'v-up', 'dead bug', 'hollow', 'superman', 'russian twist', 'bicycle', 'leg raise', 'sit-up'] },
  { name: 'Glutes', keywords: ['glute', 'hip thrust', 'bridge'] },
]

const guessMuscleGroup = (exerciseName) => {
  const lower = exerciseName.toLowerCase()
  for (const group of MUSCLE_GROUPS) {
    for (const kw of group.keywords) {
      if (lower.includes(kw)) {
        return group.name
      }
    }
  }
  return null
}

const extractExerciseName = (routineString) => {
  const match = routineString.match(/(?:^|\d+x\d+\s+)(.*?)(?:\s*\(.*?\))?\s*$/)
  if (match) return match[1].trim()
  return routineString
}

const getBarColor = (percent) => {
  if (percent === 0) return 'bg-zinc-800'
  if (percent < 25) return 'bg-blue-500'
  if (percent < 50) return 'bg-emerald-500'
  if (percent < 75) return 'bg-orange-500'
  return 'bg-red-500'
}

const getTextColor = (percent) => {
  if (percent === 0) return 'text-zinc-600'
  if (percent < 25) return 'text-blue-400'
  if (percent < 50) return 'text-emerald-400'
  if (percent < 75) return 'text-orange-400'
  return 'text-red-400'
}

const MuscleHeatmap = ({ exerciseLogs, routine }) => {
  const groupVolumes = useMemo(() => {
    const volumes = {}
    for (const g of MUSCLE_GROUPS) {
      volumes[g.name] = 0
    }

    const now = new Date()
    for (let i = 0; i < 7; i++) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = toDateKey(d)
      const dayLogs = exerciseLogs[key] || []

      for (const log of dayLogs) {
        const rawName = routine[log.exerciseIndex] || ''
        const name = extractExerciseName(rawName)
        const group = guessMuscleGroup(name)
        if (group && volumes[group] !== undefined) {
          volumes[group] += log.sets.length
        }
      }
    }

    return volumes
  }, [exerciseLogs, routine])

  const maxVolume = Math.max(...Object.values(groupVolumes), 1)

  return (
    <div className="mb-10 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
      <h3 className="text-lg font-bold text-white mb-6">This Week&apos;s Muscle Coverage</h3>

      <div className="grid grid-cols-2 gap-3">
        {MUSCLE_GROUPS.map((group) => {
          const sets = groupVolumes[group.name]
          const percent = Math.round((sets / maxVolume) * 100)
          const barColor = getBarColor(percent)
          const textColor = getTextColor(percent)

          return (
            <div key={group.name} className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-zinc-300">{group.name}</span>
                <span className={`text-xs font-bold ${textColor}`}>{sets} sets</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MuscleHeatmap
