import { create } from 'zustand'

export interface ModelEstimate {
  id: string
  name: string
  volume?: number
  thumbnailUrl?: string
  [key: string]: unknown
}

interface EstimateStoreState {
  selectedModels: ModelEstimate[]
  setSelectedModels: (models: ModelEstimate[]) => void
  clearSelectedModels: () => void
}

export const useEstimateStore = create<EstimateStoreState>((set) => ({
  selectedModels: [],

  setSelectedModels: (models: ModelEstimate[]) => {
    console.debug('[useEstimateStore] setSelectedModels:', models)
    set({ selectedModels: models })
  },

  clearSelectedModels: () => {
    console.debug('[useEstimateStore] clearSelectedModels()')
    set({ selectedModels: [] })
  },
}))