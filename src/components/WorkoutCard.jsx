import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Bell, BellOff, CheckCircle2, Circle, Pause, Play, SkipForward, Square, Volume2 } from 'lucide-react';

const WorkoutCard = ({ workout, punishments = [], dailyProgress = [], toggleExercise, isCompleted, onComplete }) => {
  const [rpeAlert, setRpeAlert] = useState(null);
  const [proteinHit, setProteinHit] = useState(null);
  const [activeTimerIndex, setActiveTimerIndex] = useState(null);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('work'); // 'work', 'rest', or 'standard'
  const [timerConfig, setTimerConfig] = useState({ maxRounds: 1, currentRound: 1, workDuration: 60, restDuration: 30 });
  const [timerAnnouncement, setTimerAnnouncement] = useState('');
  const [timerAlertsEnabled, setTimerAlertsEnabled] = useState(() => {
    const stored = localStorage.getItem('gympal_timer_alerts');
    return stored ? stored === 'on' : true;
  });

  const audioCtxRef = useRef(null);
  const wakeLockRef = useRef(null);
  const countdownCueRef = useRef(new Set());

  const fullRoutine = [...(workout?.routine || []), ...(punishments || [])];
  const allExercisesChecked = fullRoutine.length > 0 && dailyProgress.length === fullRoutine.length;

  const parseSkippingConfig = (exerciseString) => {
    let rounds = 1;
    let work = 60;
    let rest = 30;

    const roundMatch = exerciseString.match(/(\d+)x/);
    if (roundMatch) rounds = Number.parseInt(roundMatch[1], 10);

    const workMatch = exerciseString.match(/(\d+)s Work/i) || exerciseString.match(/(\d+)s High-Knees/i);
    if (workMatch) work = Number.parseInt(workMatch[1], 10);

    const restMatch = exerciseString.match(/(\d+)s Rest/i);
    if (restMatch) rest = Number.parseInt(restMatch[1], 10);

    const minMatch = exerciseString.match(/(\d+)\s*Min/i) || exerciseString.match(/(\d+)m/i);
    if (minMatch && !exerciseString.includes('Work')) {
      work = Number.parseInt(minMatch[1], 10) * 60;
      rest = 0;
      rounds = 1;
    }

    return { maxRounds: rounds, currentRound: 1, workDuration: work, restDuration: rest };
  };

  const vibrate = useCallback((pattern = 50) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      }
    } catch (err) {
      console.warn(`Wake Lock error: ${err.name}, ${err.message}`);
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current !== null) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => {
      releaseWakeLock();
    };
  }, [isRunning, requestWakeLock, releaseWakeLock]);

  const unlockAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playTone = useCallback((frequency = 800, duration = 0.5, maxGain = 0.35) => {
    try {
      unlockAudio();
      const audioCtx = audioCtxRef.current;

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;

      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(maxGain, audioCtx.currentTime + 0.02);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (error) {
      console.log('Audio disabled or not supported', error);
    }
  }, [unlockAudio]);

  const playCompletionAlert = useCallback(() => {
    playTone(820, 0.45, 0.3);
  }, [playTone]);

  const playCountdownTick = useCallback(() => {
    playTone(620, 0.08, 0.12);
  }, [playTone]);

  const handleRpeChange = (event) => {
    event.stopPropagation();
    const value = Number.parseInt(event.target.value, 10);
    if (value <= 5 && value > 0) {
      setRpeAlert('RPE is too low! Time to move to Phase 2 immediately to build muscle.');
      vibrate([50, 50, 100]);
      setTimeout(() => setRpeAlert(null), 5000);
    }
  };

  const handleTimerDone = useCallback((index) => {
    if (index === null || index === undefined) return;

    if (timerAlertsEnabled) {
      playCompletionAlert();
      vibrate([100, 50, 100]);
    }

    setTimerAnnouncement('Interval complete. Exercise marked done.');
    toggleExercise(index);
    setActiveTimerIndex(null);
    setIsRunning(false);
    setTime(0);
    setTimerMode('standard');
    countdownCueRef.current.clear();
  }, [playCompletionAlert, timerAlertsEnabled, toggleExercise, vibrate]);

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((currentTime) => {
          if (timerMode === 'work' || timerMode === 'rest') {
            if (timerAlertsEnabled && currentTime > 1 && currentTime <= 4 && !countdownCueRef.current.has(currentTime)) {
              countdownCueRef.current.add(currentTime);
              playCountdownTick();
            }

            if (currentTime <= 1) {
              countdownCueRef.current.clear();
              const isFinalWorkTick = timerMode === 'work' && timerConfig.currentRound >= timerConfig.maxRounds;

              if (timerAlertsEnabled && !isFinalWorkTick) {
                playCompletionAlert();
                vibrate([100, 50, 100]);
              }

              if (timerMode === 'work') {
                if (timerConfig.currentRound >= timerConfig.maxRounds) {
                  setTimerAnnouncement('Final round complete. Marking this exercise done.');
                  return 0;
                }

                if (timerConfig.restDuration <= 0) {
                  setTimerConfig((prev) => ({ ...prev, currentRound: prev.currentRound + 1 }));
                  setTimerAnnouncement('Work complete. Next round started.');
                  return timerConfig.workDuration;
                }

                setTimerMode('rest');
                setTimerAnnouncement('Work complete. Rest started.');
                return timerConfig.restDuration;
              }

              setTimerMode('work');
              setTimerConfig((prev) => ({ ...prev, currentRound: prev.currentRound + 1 }));
              setTimerAnnouncement('Rest complete. Back to work.');
              return timerConfig.workDuration;
            }

            return currentTime - 1;
          }

          return currentTime + 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, timerMode, timerConfig, timerAlertsEnabled, playCountdownTick, playCompletionAlert, vibrate]);

  useEffect(() => {
    let timeoutId;
    if (isRunning && timerMode === 'work' && time === 0 && timerConfig.currentRound >= timerConfig.maxRounds) {
      timeoutId = setTimeout(() => handleTimerDone(activeTimerIndex), 0);
    }
    return () => clearTimeout(timeoutId);
  }, [time, isRunning, timerMode, timerConfig.currentRound, timerConfig.maxRounds, activeTimerIndex, handleTimerDone]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const resetTimerForCurrentExercise = useCallback(() => {
    vibrate(30);
    setIsRunning(false);
    countdownCueRef.current.clear();

    if (timerMode === 'work' || timerMode === 'rest') {
      setTimerConfig((prev) => ({ ...prev, currentRound: 1 }));
      setTimerMode('work');
      setTime(timerConfig.workDuration);
      setTimerAnnouncement('Timer reset to round 1.');
      return;
    }

    setTime(0);
    setTimerAnnouncement('Stopwatch reset.');
  }, [timerMode, timerConfig.workDuration, vibrate]);

  const handleSkipPhase = useCallback((index) => {
    if (timerMode !== 'work' && timerMode !== 'rest') return;

    vibrate(30);
    countdownCueRef.current.clear();

    if (timerMode === 'work') {
      if (timerConfig.currentRound >= timerConfig.maxRounds) {
        handleTimerDone(index);
        return;
      }

      if (timerConfig.restDuration <= 0) {
        setTimerConfig((prev) => ({ ...prev, currentRound: prev.currentRound + 1 }));
        setTime(timerConfig.workDuration);
        setTimerAnnouncement('Work skipped. Next round started.');
        return;
      }

      setTimerMode('rest');
      setTime(timerConfig.restDuration);
      setTimerAnnouncement('Work skipped. Rest started.');
      return;
    }

    setTimerMode('work');
    setTimerConfig((prev) => ({ ...prev, currentRound: prev.currentRound + 1 }));
    setTime(timerConfig.workDuration);
    setTimerAnnouncement('Rest skipped. Back to work.');
  }, [timerMode, timerConfig, handleTimerDone, vibrate]);

  const toggleTimerAlerts = () => {
    const next = !timerAlertsEnabled;
    setTimerAlertsEnabled(next);
    localStorage.setItem('gympal_timer_alerts', next ? 'on' : 'off');
    setTimerAnnouncement(next ? 'Timer alerts enabled.' : 'Timer alerts disabled.');
  };

  const openSkippingTimer = useCallback((exerciseText, index) => {
    const config = parseSkippingConfig(exerciseText);
    setTimerConfig(config);
    setActiveTimerIndex(index);
    setIsRunning(false);
    setTimerMode('work');
    setTime(config.workDuration);
    countdownCueRef.current.clear();
    setTimerAnnouncement('Timer ready. Press start.');
  }, []);

  const closeActiveTimer = useCallback(() => {
    setActiveTimerIndex(null);
    setIsRunning(false);
    setTime(0);
    setTimerMode('standard');
    countdownCueRef.current.clear();
  }, []);

  const toggleExerciseRow = (index, exercise) => {
    if (isCompleted) return;

    const isChecked = dailyProgress.includes(index);
    const isSkipping = exercise.toLowerCase().includes('skipping') || exercise.toLowerCase().includes('skip');

    if (exercise.includes('Jog (3-5km) OR Skip (30m)')) return;

    if (isSkipping && !isChecked) {
      if (activeTimerIndex === index) {
        vibrate(30);
        closeActiveTimer();
      } else {
        vibrate(30);
        openSkippingTimer(exercise, index);
      }
      return;
    }

    if (activeTimerIndex === index) {
      vibrate(30);
      toggleExercise(index);
      closeActiveTimer();
      return;
    }

    vibrate(50);
    toggleExercise(index);
  };

  const handleCardioChoice = (index, choice) => {
    vibrate(40);

    if (choice === 'jog') {
      toggleExercise(index);
      closeActiveTimer();
      return;
    }

    if (activeTimerIndex === index) {
      closeActiveTimer();
      return;
    }

    openSkippingTimer(fullRoutine[index], index);
  };

  const handleExerciseKeyDown = (event, index, exercise) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExerciseRow(index, exercise);
    }
  };

  const getPhaseGradient = (phase) => {
    switch (phase) {
      case 2:
        return 'from-orange-500 to-yellow-500';
      case 3:
        return 'from-red-600 to-orange-500';
      case 1:
      default:
        return 'from-blue-400 to-emerald-400';
    }
  };

  const getButtonGradient = (phase) => {
    switch (phase) {
      case 2:
        return 'from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]';
      case 3:
        return 'from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]';
      case 1:
      default:
        return 'from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]';
    }
  };

  const phaseGradient = getPhaseGradient(workout.phase);

  return (
    <div className={`p-4 sm:p-6 rounded-2xl transition-all duration-300 ${isCompleted ? 'bg-zinc-900 border border-emerald-900/50' : 'bg-zinc-900 border border-zinc-800 hover:border-zinc-700'}`}>
      <div className="flex justify-between items-start mb-6 gap-3">
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${phaseGradient}`}>
            Phase {workout.phase}: {workout.title}
          </h2>
          <span className="text-sm text-zinc-400 inline-block mt-1 bg-zinc-800/50 px-2 py-1 rounded-md">
            Intensity:
            <span
              className={
                workout.intensity === 'High'
                  ? 'text-orange-400 ml-1 font-medium'
                  : workout.intensity === 'Extreme'
                    ? 'text-red-400 ml-1 font-medium'
                    : 'text-blue-400 ml-1 font-medium'
              }
            >
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

      {rpeAlert && (
        <div role="status" aria-live="polite" className="mb-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium flex items-center animate-in fade-in">
          <AlertTriangle size={18} className="mr-2 shrink-0" />
          {rpeAlert}
        </div>
      )}

      <div className="space-y-3">
        {fullRoutine.map((exercise, index) => {
          const isItemChecked = dailyProgress.includes(index) || isCompleted;
          const isPunishment = index >= (workout?.routine?.length || 0);
          const isDualCardio = exercise.includes('Jog (3-5km) OR Skip (30m)');
          const isSkipping = exercise.toLowerCase().includes('skipping') || exercise.toLowerCase().includes('skip');
          const isTimerActive = activeTimerIndex === index;

          return (
            <div key={index} className="flex flex-col gap-2">
              <div
                onClick={() => toggleExerciseRow(index, exercise)}
                onKeyDown={(event) => handleExerciseKeyDown(event, index, exercise)}
                tabIndex={isCompleted ? -1 : 0}
                role="button"
                aria-pressed={isItemChecked}
                aria-disabled={isCompleted}
                aria-label={`Exercise ${index + 1}: ${exercise}`}
                className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 ${
                  isCompleted
                    ? 'bg-zinc-950/50 text-zinc-500'
                    : isItemChecked
                      ? 'bg-emerald-950/30 border border-emerald-900/30'
                      : isPunishment
                        ? 'bg-red-950/20 border border-red-900/30'
                        : 'bg-zinc-800/50 hover:bg-zinc-800'
                } ${isDualCardio && !isItemChecked ? 'flex-col items-start gap-4' : ''}`}
              >
                <div className="flex items-center w-full">
                  {isItemChecked ? (
                    <CheckCircle2 size={20} className="text-emerald-500 mr-3 shrink-0" />
                  ) : (
                    <Circle size={20} className={isPunishment ? 'text-red-500/70 mr-3 shrink-0' : 'text-zinc-600 mr-3 shrink-0'} />
                  )}
                  <span
                    className={`font-medium ${
                      isItemChecked
                        ? 'line-through text-zinc-500'
                        : isPunishment
                          ? 'text-red-100'
                          : 'text-zinc-100'
                    }`}
                  >
                    {isItemChecked && isDualCardio ? 'Cardio Done!' : exercise}
                  </span>

                  {!isDualCardio && exercise.toLowerCase().includes('skipping') && !isItemChecked && !isTimerActive && (
                    <span className="ml-auto text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">Tap for Timer</span>
                  )}

                  {!isTimerActive && !isDualCardio && !isPunishment && !isSkipping && (
                    <div className="ml-auto relative" onClick={(event) => event.stopPropagation()}>
                      <select
                        defaultValue=""
                        aria-label={`Rate perceived effort for ${exercise}`}
                        className="appearance-none text-[10px] md:text-xs bg-zinc-800/80 border border-zinc-700/50 hover:border-emerald-500/50 hover:bg-zinc-800 text-zinc-300 rounded-lg pl-2 pr-7 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium cursor-pointer shadow-sm w-[90px] md:w-auto"
                        onChange={handleRpeChange}
                      >
                        <option value="" disabled hidden>RPE</option>
                        <option value="10">🔥 RPE 10 (Failure)</option>
                        <option value="9">🥵 RPE 9 (1 left)</option>
                        <option value="8">😤 RPE 8 (2 left)</option>
                        <option value="7">💪 RPE 7 (3 left)</option>
                        <option value="6">🙂 RPE 6 (4 left)</option>
                        <option value="5">🥱 RPE 5 (Too Easy)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-zinc-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {isDualCardio && !isItemChecked && (
                  <div className="flex gap-3 w-full pl-8 mt-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        unlockAudio();
                        handleCardioChoice(index, 'jog');
                      }}
                      className="flex-1 py-2 rounded-lg bg-zinc-700/50 hover:bg-zinc-700 text-sm font-medium transition-colors border border-zinc-600"
                    >
                      🏃‍♂️ Jog
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        unlockAudio();
                        handleCardioChoice(index, 'skip');
                      }}
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

              {isTimerActive && !isItemChecked && (
                <div
                  className={`bg-zinc-950 p-4 rounded-xl border flex flex-col items-center justify-center gap-4 mt-1 mb-2 animate-in slide-in-from-top-2 ${
                    timerMode === 'work'
                      ? 'border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                      : timerMode === 'rest'
                        ? 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                        : 'border-blue-500/30'
                  }`}
                >
                  {(timerMode === 'work' || timerMode === 'rest') && (
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                          timerMode === 'work' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {timerMode === 'work' ? 'Work' : 'Rest'}
                      </div>
                      {timerConfig.maxRounds > 1 && (
                        <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider bg-zinc-900/50 px-2 py-0.5 rounded-md border border-zinc-800/50">
                          Round {timerConfig.currentRound} / {timerConfig.maxRounds}
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className={`text-5xl font-mono font-black tracking-tighter ${
                      timerMode === 'work'
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400'
                        : timerMode === 'rest'
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400'
                          : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400'
                    }`}
                  >
                    {formatTime(time)}
                  </div>

                  <p aria-live="polite" className="text-xs text-zinc-400 text-center min-h-4">
                    {timerAnnouncement}
                  </p>

                  <div className="flex gap-3 w-full">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        unlockAudio();
                        vibrate(30);
                        setIsRunning(!isRunning);
                        setTimerAnnouncement(isRunning ? 'Timer paused.' : 'Timer running.');
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold transition-all ${
                        isRunning ? 'bg-zinc-800 text-zinc-300' : 'bg-blue-600 text-white hover:bg-blue-500'
                      }`}
                    >
                      {isRunning ? <Pause size={18} /> : <Play size={18} />}
                      {isRunning ? 'Pause' : 'Start'}
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        resetTimerForCurrentExercise();
                      }}
                      className="p-2.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                      aria-label="Reset timer"
                    >
                      <Square size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleTimerDone(index);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 font-bold transition-colors"
                    >
                      <Volume2 size={18} />
                      Done
                    </button>
                  </div>

                  <div className="flex gap-2 w-full">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleTimerAlerts();
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      {timerAlertsEnabled ? <Bell size={14} /> : <BellOff size={14} />}
                      {timerAlertsEnabled ? 'Alerts On' : 'Alerts Off'}
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleSkipPhase(index);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      <SkipForward size={14} />
                      {timerMode === 'rest' ? 'Skip Rest' : 'Skip Phase'}
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
          type="button"
          onClick={() => {
            vibrate([50, 50, 100]);
            onComplete();
          }}
          disabled={!allExercisesChecked}
          className={`w-full mt-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            allExercisesChecked
              ? `bg-gradient-to-r ${getButtonGradient(workout.phase)} text-white hover:scale-[1.02]`
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          <CheckCircle2 size={24} />
          {allExercisesChecked ? 'Complete Workout' : 'Check off all exercises'}
        </button>
      )}

      {isCompleted && (
        <div className="mt-6 p-5 rounded-xl bg-zinc-950/50 border border-zinc-800/80 shadow-inner">
          <h4 className="text-zinc-100 font-bold mb-3 flex items-center gap-2">
            <span className="text-emerald-400">🥩</span> Post-Workout Checkpoint
          </h4>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-sm font-medium text-zinc-300">Did you hit 130g of protein today?</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setProteinHit(true);
                }}
                aria-pressed={proteinHit === true}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  proteinHit === true
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setProteinHit(false);
                }}
                aria-pressed={proteinHit === false}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  proteinHit === false
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                No
              </button>
            </div>
          </div>
          {proteinHit === false && (
            <div className="mt-4 p-3 bg-red-950/30 border border-red-900/50 rounded-lg animate-in fade-in slide-in-from-top-2">
              <p className="text-sm font-medium text-red-400">Muscle is built in the kitchen. Tomorrow is a new day!</p>
            </div>
          )}
          {proteinHit === true && (
            <div className="mt-4 p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-lg animate-in fade-in slide-in-from-top-2">
              <p className="text-sm font-medium text-emerald-400">Excellent. That's your armor against muscle loss during this cut.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutCard;
