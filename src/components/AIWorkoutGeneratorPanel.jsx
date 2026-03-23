import React, { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';

const fallbackWorkout = (goal, equipment, daysPerWeek) => {
  const normalizedGoal = goal.toLowerCase();
  const normalizedEquipment = equipment.toLowerCase();
  const usesWeights = /dumbbell|barbell|kettlebell|weights/.test(normalizedEquipment);

  const isFatLossGoal = /cut|fat|lean|weight/.test(normalizedGoal);
  const isMuscleGoal = /muscle|size|hypertrophy|strength/.test(normalizedGoal);
  const isEnduranceGoal = /run|stamina|endurance|cardio/.test(normalizedGoal);

  const routine = [];

  if (isEnduranceGoal) {
    routine.push('20 Minutes Tempo Jog (Zone 3)');
  } else if (isFatLossGoal) {
    routine.push('15x 40s Work / 20s Rest Skipping');
  } else {
    routine.push('10x 60s Work / 30s Rest Skipping');
  }

  routine.push(usesWeights ? '4x8 Goblet Squats' : '4x20 Bodyweight Squats');
  routine.push(usesWeights ? '4x8 Bent-Over Rows' : '3x12 Prone Y-T-W Raises');
  routine.push(isMuscleGoal ? '4x10 Push-ups (slow eccentric)' : '3x12 Push-ups');
  routine.push(daysPerWeek >= 5 ? '3x45s Hollow Body Hold' : '3x35s Plank');
  routine.push('3x20 Mountain Climbers');
  routine.push('2x60s Mobility Cooldown');

  return {
    phase: isMuscleGoal ? 2 : 1,
    title: `AI Plan: ${goal || 'Balanced Fitness'} (${daysPerWeek} days/week)`,
    description: `Generated locally using your goal and available equipment: ${equipment || 'Bodyweight only'}.`,
    intensity: isFatLossGoal || isEnduranceGoal ? 'High' : 'Medium',
    routine,
  };
};

const normalizeWorkout = (input, fallback) => {
  if (!input || typeof input !== 'object') return fallback;

  const routine = Array.isArray(input.routine)
    ? input.routine.filter((step) => typeof step === 'string' && step.trim().length > 0)
    : [];

  if (routine.length === 0) return fallback;

  const safeIntensity = ['Low', 'Medium', 'High', 'Extreme'].includes(input.intensity)
    ? input.intensity
    : fallback.intensity;

  return {
    phase: Number.isFinite(input.phase) ? Math.max(1, Math.min(3, Math.round(input.phase))) : fallback.phase,
    title: typeof input.title === 'string' && input.title.trim().length > 0 ? input.title.trim() : fallback.title,
    description: typeof input.description === 'string' && input.description.trim().length > 0
      ? input.description.trim()
      : fallback.description,
    intensity: safeIntensity,
    routine,
  };
};

const tryParseWorkoutJson = (content) => {
  if (!content || typeof content !== 'string') return null;

  const startIndex = content.indexOf('{');
  const endIndex = content.lastIndexOf('}');
  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) return null;

  try {
    return JSON.parse(content.slice(startIndex, endIndex + 1));
  } catch {
    return null;
  }
};

const AIWorkoutGeneratorPanel = ({ onApplyWorkout }) => {
  const [goal, setGoal] = useState('Lean muscle while keeping cardio performance');
  const [equipment, setEquipment] = useState('Bodyweight, skipping rope, dumbbells');
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const [generatorSource, setGeneratorSource] = useState('local');

  const fallback = useMemo(
    () => fallbackWorkout(goal, equipment, daysPerWeek),
    [goal, equipment, daysPerWeek],
  );

  const generateWithAnthropic = async () => {
    const prompt = `You are generating a single-day workout routine.
Goal: ${goal}
Equipment: ${equipment}
Training days per week: ${daysPerWeek}

Return ONLY valid JSON with this exact shape:
{
  "phase": number 1-3,
  "title": string,
  "description": string,
  "intensity": "Low" | "Medium" | "High" | "Extreme",
  "routine": string[]
}

Routine must include 6-9 items and be realistic for home training.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey.trim(),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-latest',
        max_tokens: 900,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed (${response.status})`);
    }

    const payload = await response.json();
    const content = Array.isArray(payload.content)
      ? payload.content.map((item) => item?.text || '').join('\n')
      : '';
    const parsed = tryParseWorkoutJson(content);

    if (!parsed) {
      throw new Error('Could not parse AI response as workout JSON.');
    }

    return parsed;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');

    try {
      if (apiKey.trim()) {
        const aiWorkout = await generateWithAnthropic();
        const normalized = normalizeWorkout(aiWorkout, fallback);
        setGeneratedWorkout(normalized);
        setGeneratorSource('ai');
      } else {
        setGeneratedWorkout(fallback);
        setGeneratorSource('local');
      }
    } catch (err) {
      setGeneratedWorkout(fallback);
      setGeneratorSource('local');
      setError(`AI request failed, fallback generator used. ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="mb-10 p-6 rounded-2xl bg-zinc-900 border border-zinc-800" aria-label="AI workout generator">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Sparkles size={18} className="text-fuchsia-400" />
        AI Workout Generator
      </h3>
      <p className="text-xs text-zinc-400 mt-1">
        Priority 6. Works locally by default, or use your Anthropic API key for cloud generation.
      </p>

      <div className="mt-4 space-y-3">
        <input
          type="text"
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-white"
          placeholder="Goal (e.g. lose fat while preserving muscle)"
          aria-label="Workout goal"
        />
        <input
          type="text"
          value={equipment}
          onChange={(event) => setEquipment(event.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-white"
          placeholder="Equipment (e.g. bodyweight, rope, dumbbells)"
          aria-label="Available equipment"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <select
            value={daysPerWeek}
            onChange={(event) => setDaysPerWeek(Number.parseInt(event.target.value, 10))}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-white"
            aria-label="Training days per week"
          >
            {[2, 3, 4, 5, 6].map((days) => (
              <option key={days} value={days}>{days} days/week</option>
            ))}
          </select>
          <input
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-white"
            placeholder="Optional Anthropic API key"
            aria-label="Anthropic API key"
          />
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-60 py-2.5 font-bold text-white transition-colors"
        >
          {isGenerating ? 'Generating...' : 'Generate Workout'}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-xs text-amber-300 bg-amber-900/20 border border-amber-700/40 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {generatedWorkout && (
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
            Source: {generatorSource === 'ai' ? 'Anthropic API' : 'Local Generator'}
          </p>
          <h4 className="text-base font-bold text-white mt-1">{generatedWorkout.title}</h4>
          <p className="text-sm text-zinc-400 mt-1">{generatedWorkout.description}</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-200">
            {generatedWorkout.routine.map((step) => (
              <li key={step} className="rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2">{step}</li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onApplyWorkout(generatedWorkout)}
            className="w-full mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 font-bold text-black transition-colors"
          >
            Use This Workout Today
          </button>
        </div>
      )}
    </section>
  );
};

export default AIWorkoutGeneratorPanel;
