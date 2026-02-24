import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const WorkoutCard = ({ workout, punishments = [], dailyProgress = [], toggleExercise, isCompleted, onComplete }) => {
  const fullRoutine = [...(workout?.routine || []), ...(punishments || [])];
  const allExercisesChecked = fullRoutine.length > 0 && dailyProgress.length === fullRoutine.length;

  return (
    <div className={`p-6 rounded-2xl transition-all duration-300 ${isCompleted ? 'bg-zinc-900 border border-emerald-900/50' : 'bg-zinc-900 border border-zinc-800 hover:border-zinc-700'}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Phase {workout.phase}: {workout.title}
          </h2>
          <span className="text-sm text-zinc-400 inline-block mt-1 bg-zinc-800/50 px-2 py-1 rounded-md">
            Intensity: 
            <span className={
              workout.intensity === 'High' ? 'text-orange-400 ml-1 font-medium' :
              workout.intensity === 'Extreme' ? 'text-red-400 ml-1 font-medium' : 'text-blue-400 ml-1 font-medium'
            }>
              {workout.intensity}
            </span>
          </span>
        </div>
        
        {isCompleted && (
          <div className="flex items-center text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle2 size={16} className="mr-1.5" />
            Done
          </div>
        )}
      </div>

      <p className="text-zinc-300 mb-6 text-sm">{workout.description}</p>

      <div className="space-y-3">
        {fullRoutine.map((exercise, index) => {
          const isItemChecked = dailyProgress.includes(index) || isCompleted;
          const isPunishment = index >= (workout?.routine?.length || 0);
          
          return (
            <div 
              key={index}
              onClick={() => !isCompleted && toggleExercise(index)}
              className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors ${
                isCompleted ? 'bg-zinc-950/50 text-zinc-500' : 
                isItemChecked ? 'bg-emerald-950/30 border border-emerald-900/30' : 
                isPunishment ? 'bg-red-950/20 border border-red-900/30' : 'bg-zinc-800/50 hover:bg-zinc-800'
              }`}
            >
              {isItemChecked ? (
                <CheckCircle2 size={20} className="text-emerald-500 mr-3 shrink-0" />
              ) : (
                <Circle size={20} className={isPunishment ? "text-red-500/70 mr-3 shrink-0" : "text-zinc-600 mr-3 shrink-0"} />
              )}
              <span className={`font-medium ${
                isItemChecked ? 'line-through text-zinc-500' : 
                isPunishment ? 'text-red-100' : 'text-zinc-100'
              }`}>
                {exercise}
              </span>
            </div>
          );
        })}
      </div>

      {!isCompleted && (
        <button
          onClick={onComplete}
          disabled={!allExercisesChecked}
          className={`w-full mt-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            allExercisesChecked 
              ? 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          <CheckCircle2 size={24} />
          {allExercisesChecked ? 'Complete Workout' : 'Check off all exercises'}
        </button>
      )}
    </div>
  );
};

export default WorkoutCard;
