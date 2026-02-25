import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Circle, Play, Pause, Square, Volume2 } from 'lucide-react';

const WorkoutCard = ({ workout, punishments = [], dailyProgress = [], toggleExercise, isCompleted, onComplete }) => {
  // Use a ref to store the AudioContext so we can reuse it
  const audioCtxRef = useRef(null);
  // Ref for the wake lock sentinel
  const wakeLockRef = useRef(null);
  
  const [activeTimerIndex, setActiveTimerIndex] = useState(null);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Request Wake Lock function
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        console.log('Wake Lock is active');
      }
    } catch (err) {
      console.warn(`Wake Lock error: ${err.name}, ${err.message}`);
    }
  };

  // Release Wake Lock function
  const releaseWakeLock = async () => {
    if (wakeLockRef.current !== null) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
      console.log('Wake Lock released');
    }
  };

  // Vibrate function
  const vibrate = (pattern = 50) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  // Manage wake lock lifecycle based on timer running state
  useEffect(() => {
    if (isRunning) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
    
    return () => {
      releaseWakeLock();
    };
  }, [isRunning]);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const playBeep = () => {
    try {
      // Re-use an existing audio context, or create a new one
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const audioCtx = audioCtxRef.current;
      
      // On iOS, we need to explicitly resume the AudioContext if it's suspended
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 800; // hz
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio disabled or not supported', e);
    }
  };

  // Helper function to initialize audio context on first user interaction
  const unlockAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const handleTimerDone = (index) => {
    playBeep();
    vibrate([100, 50, 100]); // Success vibration
    toggleExercise(index); // Mark as complete
    setActiveTimerIndex(null);
    setIsRunning(false);
    setTime(0);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const toggleExerciseRow = (index, exercise) => {
    if (isCompleted) return;
    
    const isChecked = dailyProgress.includes(index);
    const isSkipping = exercise.toLowerCase().includes('skipping') || exercise.toLowerCase().includes('skip');
    
    // If it's a dual choice, we don't toggle it directly by clicking the row.
    // The user must click the specific 'Jog' or 'Skip' buttons we render.
    if (exercise.includes('Jog (3-5km) OR Skip (30m)')) return;

    if (isSkipping && !isChecked) {
      if (activeTimerIndex === index) {
        vibrate(30); // Light tap
        setActiveTimerIndex(null);
        setIsRunning(false);
        setTime(0);
      } else {
        vibrate(30); // Light tap
        setActiveTimerIndex(index);
        setIsRunning(false);
        setTime(0);
      }
    } else if (activeTimerIndex === index) {
       vibrate(30);
       toggleExercise(index);
       setActiveTimerIndex(null);
       setIsRunning(false);
       setTime(0);
    } else {
      vibrate(50); // Standard toggle vibration
      toggleExercise(index);
    }
  };

  const handleCardioChoice = (index, choice) => {
    vibrate(40);
    if (choice === 'jog') {
      // Just check it off immediately
      toggleExercise(index);
      setActiveTimerIndex(null);
      setIsRunning(false);
      setTime(0);
    } else if (choice === 'skip') {
      // Open the timer for skipping
      if (activeTimerIndex === index) {
        setActiveTimerIndex(null);
        setIsRunning(false);
        setTime(0);
      } else {
        setActiveTimerIndex(index);
        setIsRunning(false);
        setTime(0);
      }
    }
  };
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
          
          const isDualCardio = exercise.includes('Jog (3-5km) OR Skip (30m)');
          const isTimerActive = activeTimerIndex === index;

          return (
            <div key={index} className="flex flex-col gap-2">
            <div 
              onClick={() => toggleExerciseRow(index, exercise)}
              className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors ${
                isCompleted ? 'bg-zinc-950/50 text-zinc-500' : 
                isItemChecked ? 'bg-emerald-950/30 border border-emerald-900/30' : 
                isPunishment ? 'bg-red-950/20 border border-red-900/30' : 'bg-zinc-800/50 hover:bg-zinc-800'
              } ${isDualCardio && !isItemChecked ? 'flex-col items-start gap-4' : ''}`}
            >
              <div className="flex items-center w-full">
                {isItemChecked ? (
                  <CheckCircle2 size={20} className="text-emerald-500 mr-3 shrink-0" />
                ) : (
                  <Circle size={20} className={isPunishment ? "text-red-500/70 mr-3 shrink-0" : "text-zinc-600 mr-3 shrink-0"} />
                )}
                <span className={`font-medium ${
                  isItemChecked ? 'line-through text-zinc-500' : 
                  isPunishment ? 'text-red-100' : 'text-zinc-100'
                }`}>
                  {isItemChecked && isDualCardio ? 'Cardio Done!' : exercise}
                </span>
                
                {/* Regular skipping hint */}
                {!isDualCardio && exercise.toLowerCase().includes('skipping') && !isItemChecked && !isTimerActive && (
                  <span className="ml-auto text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">Tap for Timer</span>
                )}
              </div>

              {/* Dual Cardio Action Buttons */}
              {isDualCardio && !isItemChecked && (
                <div className="flex gap-3 w-full pl-8 mt-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); unlockAudio(); handleCardioChoice(index, 'jog'); }}
                    className="flex-1 py-2 rounded-lg bg-zinc-700/50 hover:bg-zinc-700 text-sm font-medium transition-colors border border-zinc-600"
                  >
                    🏃‍♂️ Jog
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); unlockAudio(); handleCardioChoice(index, 'skip'); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      isTimerActive 
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                        : 'bg-zinc-700/50 hover:bg-zinc-700 border-zinc-600'
                    }`}
                  >
                    ⏱️ Skip
                  </button>
                </div>
              )}
            </div>

            {/* Timer UI */}
            {isTimerActive && !isItemChecked && (
              <div className="bg-zinc-950 p-4 rounded-xl border border-blue-500/30 flex flex-col items-center justify-center gap-4 mt-1 mb-2 animate-in slide-in-from-top-2">
                <div className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  {formatTime(time)}
                </div>
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={(e) => { e.stopPropagation(); unlockAudio(); vibrate(30); setIsRunning(!isRunning); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold transition-all ${
                      isRunning ? 'bg-zinc-800 text-zinc-300' : 'bg-blue-600 text-white hover:bg-blue-500'
                    }`}
                  >
                    {isRunning ? <Pause size={18} /> : <Play size={18} />}
                    {isRunning ? 'Pause' : 'Start'}
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); vibrate(30); setTime(0); setIsRunning(false); }}
                    className="p-2.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  >
                    <Square size={18} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleTimerDone(index); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 font-bold transition-colors"
                  >
                    <Volume2 size={18} />
                    Done
                  </button>
                </div>
              </div>
            )}
            </div>
          );
        })}
      </div>

      {!isCompleted && (
        <button
          onClick={() => { vibrate([50, 50, 100]); onComplete(); }}
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
