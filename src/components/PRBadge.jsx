import { useEffect } from 'react'
import { Trophy } from 'lucide-react'

const PRBadge = ({ prType, exerciseName, newValue, oldValue, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/30 min-w-[260px] max-w-sm">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <Trophy size={20} className="text-black" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider opacity-70">New {prType} PR!</span>
          <span className="text-sm font-bold truncate">{exerciseName}</span>
          <span className="text-xs font-medium opacity-80">{oldValue} → {newValue}</span>
        </div>
      </div>
    </div>
  )
}

export default PRBadge
