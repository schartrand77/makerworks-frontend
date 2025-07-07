import axios from '@/api/axios'

export interface Filament {
  id: string
  type: string
  color: string
  hex: string
}

/**
 * Fetch available filaments from the backend.
 */
export async function fetchAvailableFilaments(): Promise<Filament[]> {
  const res = await axios.get<Filament[]>('/api/filaments')
  return res.data
}