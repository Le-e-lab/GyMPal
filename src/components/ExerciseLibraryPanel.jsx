import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { exerciseLibrary } from '../data/exerciseLibrary';

const ExerciseLibraryPanel = () => {
  const [query, setQuery] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('All');
  const [equipmentFilter, setEquipmentFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [selectedExerciseId, setSelectedExerciseId] = useState(exerciseLibrary[0]?.id || null);

  const filterOptions = useMemo(() => {
    const muscles = ['All', ...new Set(exerciseLibrary.map((item) => item.muscleGroup))];
    const equipment = ['All', ...new Set(exerciseLibrary.map((item) => item.equipment))];
    const difficulty = ['All', ...new Set(exerciseLibrary.map((item) => item.difficulty))];

    return { muscles, equipment, difficulty };
  }, []);

  const filteredExercises = useMemo(() => (
    exerciseLibrary.filter((exercise) => {
      const matchesQuery = query.trim().length === 0
        || exercise.name.toLowerCase().includes(query.toLowerCase())
        || exercise.type.toLowerCase().includes(query.toLowerCase());
      const matchesMuscle = muscleFilter === 'All' || exercise.muscleGroup === muscleFilter;
      const matchesEquipment = equipmentFilter === 'All' || exercise.equipment === equipmentFilter;
      const matchesDifficulty = difficultyFilter === 'All' || exercise.difficulty === difficultyFilter;

      return matchesQuery && matchesMuscle && matchesEquipment && matchesDifficulty;
    })
  ), [query, muscleFilter, equipmentFilter, difficultyFilter]);

  const selectedExercise = filteredExercises.find((item) => item.id === selectedExerciseId) || filteredExercises[0] || null;

  return (
    <section className="mb-10 p-6 rounded-2xl bg-zinc-900 border border-zinc-800" aria-label="Exercise library browser">
      <h3 className="text-lg font-bold text-white">Exercise Library (Offline Bundle)</h3>
      <p className="text-xs text-zinc-400 mt-1">
        Built for priority 3: local first exercise DB with no API key required.
      </p>

      <div className="mt-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search exercise or type"
          className="w-full rounded-xl bg-zinc-950 border border-zinc-700 text-white pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
        />
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <select
          value={muscleFilter}
          onChange={(event) => setMuscleFilter(event.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-200 text-sm px-2 py-2"
          aria-label="Filter by muscle group"
        >
          {filterOptions.muscles.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <select
          value={equipmentFilter}
          onChange={(event) => setEquipmentFilter(event.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-200 text-sm px-2 py-2"
          aria-label="Filter by equipment"
        >
          {filterOptions.equipment.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <select
          value={difficultyFilter}
          onChange={(event) => setDifficultyFilter(event.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-200 text-sm px-2 py-2"
          aria-label="Filter by difficulty"
        >
          {filterOptions.difficulty.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {filteredExercises.length === 0 ? (
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-400">
          No exercises match your filters.
        </div>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-[1.2fr_1fr]">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3 max-h-80 overflow-auto">
            <div className="space-y-2">
              {filteredExercises.map((exercise) => {
                const isSelected = selectedExercise?.id === exercise.id;
                return (
                  <button
                    key={exercise.id}
                    type="button"
                    onClick={() => setSelectedExerciseId(exercise.id)}
                    className={`w-full text-left rounded-lg border px-3 py-2 transition-colors ${
                      isSelected
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
                        : 'border-zinc-800 bg-zinc-900/70 text-zinc-200 hover:bg-zinc-800'
                    }`}
                  >
                    <p className="font-semibold text-sm">{exercise.name}</p>
                    <p className="text-[11px] mt-1 opacity-80">
                      {exercise.muscleGroup} • {exercise.equipment} • {exercise.difficulty}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedExercise && (
            <article className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
              <h4 className="font-bold text-white text-base">{selectedExercise.name}</h4>
              <p className="text-xs text-zinc-500 mt-1">
                {selectedExercise.type} • {selectedExercise.muscleGroup} • {selectedExercise.difficulty}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                {selectedExercise.instructions.map((step) => (
                  <li key={step} className="rounded-lg bg-zinc-900/70 border border-zinc-800 px-3 py-2">
                    {step}
                  </li>
                ))}
              </ul>
            </article>
          )}
        </div>
      )}
    </section>
  );
};

export default ExerciseLibraryPanel;
