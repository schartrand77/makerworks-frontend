import axios from './axios'

export interface EstimatePayload {
  modelId: string
  volume: number
  filamentType: string
  filamentColors: string[]
  dimensions: { x: number; y: number; z: number }
  customText?: string
  printProfile?: 'standard' | 'quality' | 'elite'
}

export interface EstimateResult {
  cost: number
  time: string
  materialWeight: number
  materialCost: number
  printDurationSeconds: number
}

export async function getEstimate(payload: EstimatePayload): Promise<EstimateResult> {
  const res = await axios.post<EstimateResult>('/estimate/estimates/', payload)
  return res.data
}
