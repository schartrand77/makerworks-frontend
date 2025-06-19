// src/store/useModelStore.js

import { create } from 'zustand'
import api from '@/api'

export const useModelStore = create((set) => ({
  models: [],
  loading: false,
  error: null,

  fetchAllModels: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get('/models')
      set({ models: res.data || [] })
    } catch (err) {
      console.error('[models] failed to fetch models:', err)
      set({ error: 'Failed to fetch models' })
    } finally {
      set({ loading: false })
    }
  },

  addModel: (model) =>
    set((state) => ({
      models: [...state.models, model],
    })),

  removeModelById: (id) =>
    set((state) => ({
      models: state.models.filter((m) => m.id !== id),
    })),
}))