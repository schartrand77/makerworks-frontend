// src/store/estimateStore.js
import { create } from 'zustand'

export const useEstimateStore = create((set) => ({
  estimateModels: [],
  selectedModelId: null,

  // NEW: Available filament options (from /filaments)
  availableFilaments: [],
  setAvailableFilaments: (filaments) => set({ availableFilaments: filaments }),

  // Existing
  addModelToEstimate: (model) =>
    set((state) => {
      const exists = state.estimateModels.some((m) => m.id === model.id)
      if (exists || state.estimateModels.length >= 5) return state
      return { estimateModels: [...state.estimateModels, model] }
    }),

  removeModelFromEstimate: (id) =>
    set((state) => ({
      estimateModels: state.estimateModels.filter((m) => m.id !== id),
      selectedModelId:
        state.selectedModelId === id ? null : state.selectedModelId,
    })),

  selectModel: (id) => set({ selectedModelId: id }),
}))