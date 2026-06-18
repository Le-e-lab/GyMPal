import { useState, useCallback } from 'react'
import { safeLocalStorage } from '../utils/storage'
import { PREBUILT_TEMPLATES } from '../data/prebuiltTemplates'

const STORAGE_KEY = 'gympal_templates'

const defaultState = {
  templates: [],
  activeTemplate: null,
  selectedDay: 0
}

const validate = (v) =>
  v && typeof v === 'object' && Array.isArray(v.templates)

const loadState = (onError) =>
  safeLocalStorage.getJSON(STORAGE_KEY, defaultState, validate, onError)

export const useTemplates = () => {
  const [storageError, setStorageError] = useState(null)
  const handleStorageError = (error) => {
    console.warn('LocalStorage error', error)
    setStorageError('Template data could not be saved.')
  }

  const [state, setStateRaw] = useState(() => loadState(handleStorageError))

  const persist = useCallback((next) => {
    setStateRaw(next)
    safeLocalStorage.setJSON(STORAGE_KEY, next, handleStorageError)
  }, [])

  const templates = state.templates
  const activeTemplate = state.activeTemplate
  const selectedDay = state.selectedDay

  const findTemplate = useCallback((templateId) => {
    const custom = state.templates.find((t) => t.id === templateId)
    if (custom) return custom
    return PREBUILT_TEMPLATES.find((t) => t.id === templateId) || null
  }, [state.templates])

  const setActiveTemplate = useCallback((templateId, dayIndex = 0) => {
    persist({
      ...state,
      activeTemplate: { id: templateId },
      selectedDay: dayIndex
    })
  }, [state, persist])

  const clearActiveTemplate = useCallback(() => {
    persist({ ...state, activeTemplate: null, selectedDay: 0 })
  }, [state, persist])

  const saveTemplate = useCallback((template) => {
    const id = template.id || `user-${Date.now()}`
    const newTemplate = { ...template, id, type: 'custom' }
    const existing = state.templates.findIndex((t) => t.id === id)
    const nextTemplates = existing >= 0
      ? state.templates.map((t) => (t.id === id ? newTemplate : t))
      : [...state.templates, newTemplate]
    persist({ ...state, templates: nextTemplates })
  }, [state, persist])

  const deleteTemplate = useCallback((templateId) => {
    const nextTemplates = state.templates.filter((t) => t.id !== templateId)
    const next = { ...state, templates: nextTemplates }
    if (state.activeTemplate?.id === templateId) {
      next.activeTemplate = null
      next.selectedDay = 0
    }
    persist(next)
  }, [state, persist])

  const advanceDay = useCallback(() => {
    if (!state.activeTemplate) return
    const template = findTemplate(state.activeTemplate.id)
    if (!template) return
    const totalDays = template.days.length
    const nextDay = (state.selectedDay + 1) % totalDays
    persist({ ...state, selectedDay: nextDay })
  }, [state, findTemplate, persist])

  const getTemplateForToday = useCallback(() => {
    if (!state.activeTemplate) return null
    const template = findTemplate(state.activeTemplate.id)
    if (!template) return null
    const day = template.days[state.selectedDay]
    if (!day) return null
    return {
      name: day.name,
      exercises: day.exercises,
      templateName: template.name
    }
  }, [state.activeTemplate, state.selectedDay, findTemplate])

  return {
    templates,
    activeTemplate,
    selectedDay,
    setActiveTemplate,
    clearActiveTemplate,
    saveTemplate,
    deleteTemplate,
    getTemplateForToday,
    advanceDay,
    storageError
  }
}
