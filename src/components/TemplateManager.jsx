import { useState } from 'react'
import { Dumbbell, Plus, Trash2, Check, X, ChevronDown, ChevronUp, Pencil } from 'lucide-react'
import { PREBUILT_TEMPLATES } from '../data/prebuiltTemplates'

const emptyExercise = { name: '', sets: 3, reps: 10 }

const TemplateManager = ({ templates, activeTemplate, selectedDay, setActiveTemplate, clearActiveTemplate, saveTemplate, deleteTemplate, advanceDay, getTemplateForToday }) => {
  const [isCreating, setIsCreating] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [newName, setNewName] = useState('')
  const [newExercises, setNewExercises] = useState([{ ...emptyExercise }])
  const [editingId, setEditingId] = useState(null)

  const today = getTemplateForToday()

  const allTemplates = [...PREBUILT_TEMPLATES, ...templates]

  const handleCreate = () => {
    const valid = newExercises.filter((e) => e.name.trim())
    if (!newName.trim() || valid.length === 0) return
    const template = {
      id: editingId || undefined,
      name: newName.trim(),
      type: 'custom',
      exercises: valid.map((e) => ({
        name: e.name.trim(),
        sets: Number(e.sets) || 3,
        reps: Number(e.reps) || 10
      }))
    }
    saveTemplate(template)
    setNewName('')
    setNewExercises([{ ...emptyExercise }])
    setIsCreating(false)
    setEditingId(null)
  }

  const handleEdit = (template) => {
    setEditingId(template.id)
    setNewName(template.name)
    setNewExercises(template.exercises.map((e) => ({ ...e })))
    setIsCreating(true)
  }

  const addExerciseRow = () => {
    setNewExercises([...newExercises, { ...emptyExercise }])
  }

  const updateExercise = (index, field, value) => {
    const updated = [...newExercises]
    updated[index] = { ...updated[index], [field]: value }
    setNewExercises(updated)
  }

  const removeExerciseRow = (index) => {
    if (newExercises.length <= 1) return
    setNewExercises(newExercises.filter((_, i) => i !== index))
  }

  const handleUseTemplate = (templateId, dayIndex = 0) => {
    setActiveTemplate(templateId, dayIndex)
    setExpandedId(null)
  }

  const handleClear = () => {
    clearActiveTemplate()
  }

  const renderDaySelector = () => {
    if (!today) return null
    const template = allTemplates.find((t) => t.id === activeTemplate?.id)
    if (!template?.days) return null
    return (
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs text-zinc-500">Day:</span>
        <select
          value={selectedDay}
          onChange={(e) => setActiveTemplate(activeTemplate.id, Number(e.target.value))}
          className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-emerald-500"
        >
          {template.days.map((day, i) => (
            <option key={i} value={i}>{day.name}</option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className="mb-6 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
      {today && (
        <div className="px-4 py-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell size={14} className="text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">{today.templateName}</span>
            <span className="text-xs text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 rounded-full">{today.name}</span>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800 px-2.5 py-1 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      <div className="px-4 py-3">
        {!today && (
          <p className="text-xs text-zinc-500 mb-3">Choose a workout template or use the default program</p>
        )}

        <div className="space-y-2">
          {allTemplates.map((template) => {
            const isActive = activeTemplate?.id === template.id
            const isExpanded = expandedId === template.id
            const isCustom = template.type === 'custom'
            const dayCount = template.days?.length || 0

            return (
              <div key={template.id} className={`rounded-xl border transition-colors ${isActive ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-800/30'}`}>
                <div
                  className="flex items-center justify-between px-3 py-2.5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : template.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-100 truncate">{template.name}</span>
                      {isActive && <Check size={12} className="text-emerald-400 shrink-0" />}
                      {isCustom && <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded shrink-0">Custom</span>}
                    </div>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">{template.description} · {dayCount} day{dayCount !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    {isExpanded ? <ChevronUp size={14} className="text-zinc-500" /> : <ChevronDown size={14} className="text-zinc-500" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-zinc-800/50">
                    {template.days?.map((day, dayIdx) => (
                      <div key={dayIdx} className="mt-2.5">
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">{day.name}</p>
                        <div className="space-y-0.5">
                          {day.exercises.map((ex, exIdx) => (
                            <p key={exIdx} className="text-xs text-zinc-300">{ex.name} {ex.sets}x{ex.reps}</p>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-2 mt-3">
                      {!isActive && (
                        <button
                          type="button"
                          onClick={() => handleUseTemplate(template.id, 0)}
                          className="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors"
                        >
                          Use This
                        </button>
                      )}
                      {isActive && (
                        <button
                          type="button"
                          onClick={() => advanceDay()}
                          className="flex-1 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700 transition-colors"
                        >
                          Next Day
                        </button>
                      )}
                      {isCustom && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleEdit(template)}
                            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-blue-400 transition-colors"
                            aria-label={`Edit ${template.name}`}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteTemplate(template.id)}
                            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
                            aria-label={`Delete ${template.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {!isCreating ? (
          <button
            type="button"
            onClick={() => { setIsCreating(true); setEditingId(null); setNewName(''); setNewExercises([{ ...emptyExercise }]) }}
            className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-zinc-700 text-zinc-400 text-xs font-medium hover:border-zinc-500 hover:text-zinc-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus size={14} />
            Create New Template
          </button>
        ) : (
          <div className="mt-3 p-3 rounded-xl border border-zinc-700 bg-zinc-800/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-zinc-300">{editingId ? 'Edit Template' : 'New Template'}</span>
              <button
                type="button"
                onClick={() => { setIsCreating(false); setEditingId(null) }}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Template name"
              className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2 mb-3 focus:outline-none focus:border-emerald-500 transition-colors"
            />

            <div className="space-y-2">
              {newExercises.map((ex, i) => (
                <div key={i} className="grid grid-cols-[1fr_3rem_3rem_1.5rem] gap-1.5 items-center">
                  <input
                    type="text"
                    value={ex.name}
                    onChange={(e) => updateExercise(i, 'name', e.target.value)}
                    placeholder="Exercise name"
                    className="bg-zinc-900 border border-zinc-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <input
                    type="number"
                    value={ex.sets}
                    onChange={(e) => updateExercise(i, 'sets', e.target.value)}
                    placeholder="Sets"
                    className="bg-zinc-900 border border-zinc-700 text-white text-xs rounded-lg px-2 py-1.5 text-center focus:outline-none focus:border-emerald-500 transition-colors"
                    min="1"
                  />
                  <input
                    type="text"
                    value={ex.reps}
                    onChange={(e) => updateExercise(i, 'reps', e.target.value)}
                    placeholder="Reps"
                    className="bg-zinc-900 border border-zinc-700 text-white text-xs rounded-lg px-2 py-1.5 text-center focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => removeExerciseRow(i)}
                    className="w-6 h-6 flex items-center justify-center rounded bg-zinc-800 text-zinc-500 hover:text-red-400 transition-colors"
                    aria-label="Remove exercise"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={addExerciseRow}
                className="flex-1 py-2 rounded-lg bg-zinc-800 text-zinc-400 text-xs font-medium hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1"
              >
                <Plus size={12} />
                Exercise
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors"
              >
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        )}

        {today && renderDaySelector()}
      </div>
    </div>
  )
}

export default TemplateManager
