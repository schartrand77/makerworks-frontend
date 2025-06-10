import { create } from 'zustand'

export const useEstimateStore = create((set) => ({
  model: null,
  setModel: (model) => set({ model }),
  resetModel: () => set({ model: null })
}))