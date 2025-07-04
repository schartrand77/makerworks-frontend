import { create } from 'zustand'

export interface ModelEstimate {
  id: string
  name: string
  volume?: number
  thumbnailUrl?: string
  [key: string]: unknown
}

export interface EstimateForm {
  x_mm: number | string
  y_mm: number | string
  z_mm: number | string
  filament_type: 'pla' | 'petg'
  filament_colors: string[]
  print_profile: 'standard' | 'quality' | 'elite'
}

export interface EstimateResult {
  estimated_time_minutes: number
  estimated_cost_usd: number
}

interface EstimateStoreState {
  selectedModels: ModelEstimate[]
  form: EstimateForm
  result: EstimateResult | null
  setSelectedModels: (models: ModelEstimate[]) => void
  clearSelectedModels: () => void
  setForm: <K extends keyof EstimateForm>(field: K, value: EstimateForm[K]) => void
  setResult: (result: EstimateResult | null) => void
}

export const useEstimateStore = create<EstimateStoreState>((set) => ({
  selectedModels: [],
  form: {
    x_mm: '',
    y_mm: '',
    z_mm: '',
    filament_type: 'pla',
    filament_colors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
    print_profile: 'standard',
  },
  result: null,

  setSelectedModels: (models: ModelEstimate[]) => {
    console.debug('[useEstimateStore] setSelectedModels:', models)
    set({ selectedModels: models })
  },

  clearSelectedModels: () => {
    console.debug('[useEstimateStore] clearSelectedModels()')
    set({ selectedModels: [] })
  },

  setForm: (field, value) => {
    console.debug('[useEstimateStore] setForm:', field, value)
    set((state) => ({ form: { ...state.form, [field]: value } }))
  },

  setResult: (result) => {
    console.debug('[useEstimateStore] setResult:', result)
    set({ result })
  },
}))
