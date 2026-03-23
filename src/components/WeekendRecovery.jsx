import React, { useState } from 'react';
import { Beaker } from 'lucide-react';

const WeekendRecovery = ({ proteinStreak, logProteinGoal }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const isProteinLoggedToday = proteinStreak > 0 && todayStr === localStorage.getItem('gympal_last_protein_date');
  const [sleepTargetMet, setSleepTargetMet] = useState(() => {
    const stored = localStorage.getItem('gympal_sleep_target_check');
    if (!stored) return false;

    const parsed = JSON.parse(stored);
    return parsed.date === todayStr ? Boolean(parsed.done) : false;
  });

  const handleSleepToggle = (event) => {
    const nextValue = event.target.checked;
    setSleepTargetMet(nextValue);
    localStorage.setItem('gympal_sleep_target_check', JSON.stringify({ date: todayStr, done: nextValue }));
  };

  const handleProteinToggle = (event) => {
    if (event.target.checked && !isProteinLoggedToday) {
      logProteinGoal();
    }
  };

  return (
    <section className="mb-10 p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800" aria-label="Weekend recovery checklist">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
          <span className="text-3xl text-blue-500">🧘‍♂️</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-400">Recovery Recharge</h2>
          <p className="text-zinc-400 text-sm mt-1">Recovery is not a sign of weakness; it's the foundation of strength.</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <label className="flex items-center p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 cursor-pointer transition-colors border border-transparent hover:border-zinc-700">
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500 bg-zinc-900 mr-4"
            checked={sleepTargetMet}
            onChange={handleSleepToggle}
            aria-label="Mark sleep target as complete"
          />
          <div className="flex-1">
            <span className="font-medium text-white block">Sleep Target</span>
            <span className="text-xs text-zinc-400">Did you get 8 hours of sleep?</span>
          </div>
        </label>

        <label className="flex items-center p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 cursor-pointer transition-colors border border-transparent hover:border-zinc-700">
          <input 
            type="checkbox" 
            className="w-5 h-5 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500 bg-zinc-900 mr-4" 
            onChange={handleProteinToggle}
            checked={isProteinLoggedToday} 
            aria-label="Mark protein goal as complete"
          />
          <div className="flex-1">
            <span className="font-medium text-white block">Protein Armor</span>
            <span className="text-xs text-zinc-400">Target: 130g of protein to maintain muscle mass</span>
          </div>
        </label>

        <a href="https://www.youtube.com/results?search_query=10+minute+full+body+stretch" target="_blank" rel="noopener noreferrer" aria-label="Open 10-minute full body stretch videos in a new tab" className="flex items-center p-4 rounded-xl bg-blue-900/20 hover:bg-blue-900/40 cursor-pointer transition-colors border border-blue-900/30">
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mr-4 shrink-0">
            <span className="text-[10px] text-white">▶</span>
          </div>
          <div className="flex-1">
            <span className="font-medium text-blue-100 block">Mobility & Stretching</span>
            <span className="text-xs text-blue-300">10-minute full-body stretch to prepare for Monday</span>
          </div>
        </a>

        <div className="flex items-center p-4 rounded-xl bg-cyan-900/20 border border-cyan-900/30 mt-4 cursor-default">
          <Beaker className="text-cyan-400 mr-4 shrink-0" size={24} />
          <div className="flex-1">
            <span className="font-medium text-cyan-100 block">Hydration Check</span>
            <span className="text-xs text-cyan-300">Aim for 3.5 Liters of water today.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeekendRecovery;
