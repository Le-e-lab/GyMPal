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
    setStateRaw(prev => {
      const newState = typeof next === 'function' ? next(prev) : next;
      safeLocalStorage.setJSON(STORAGE_KEY, newState, handleStorageError);
      return newState;
    });
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
    persist((prev) => ({
      ...prev,
      activeTemplate: { id: templateId },
      selectedDay: dayIndex
    }))
  }, [persist])

  const clearActiveTemplate = useCallback(() => {
    persist((prev) => ({ ...prev, activeTemplate: null, selectedDay: 0 }))
  }, [persist])

  const saveTemplate = useCallback((template) => {
    const id = template.id || `user-${Date.now()}`
    const newTemplate = { ...template, id, type: 'custom' }
    persist((prev) => {
      const existing = prev.templates.findIndex((t) => t.id === id)
      const nextTemplates = existing >= 0
        ? prev.templates.map((t) => (t.id === id ? newTemplate : t))
        : [...prev.templates, newTemplate]
      return { ...prev, templates: nextTemplates }
    })
  }, [persist])

  const deleteTemplate = useCallback((templateId) => {
    persist((prev) => {
      const nextTemplates = prev.templates.filter((t) => t.id !== templateId)
      const next = { ...prev, templates: nextTemplates }
      if (prev.activeTemplate?.id === templateId) {
        next.activeTemplate = null
        next.selectedDay = 0
      }
      return next
    })
  }, [persist])

  const advanceDay = useCallback(() => {
    persist((prev) => {
      if (!prev.activeTemplate) return prev
      const template = findTemplate(prev.activeTemplate.id)
      if (!template) return prev
      const totalDays = template.days.length
      const nextDay = (prev.selectedDay + 1) % totalDays
      return { ...prev, selectedDay: nextDay }
    })
  }, [findTemplate, persist])

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
