import axios from './axios'
import type { Filament } from './filaments'

export interface AdminUser {
  id: string
  username: string
  email: string
  banned?: boolean
}

export interface Model {
  id: string
  name: string
  description?: string
}

export async function fetchAllUsers(): Promise<AdminUser[]> {
  const res = await axios.get<AdminUser[]>('/admin/users')
  return res.data
}

export async function banUser(userId: string): Promise<void> {
  await axios.post(`/admin/users/${userId}/ban`)
}

export async function fetchAllModels(): Promise<Model[]> {
  const res = await axios.get<Model[]>('/models')
  return res.data
}

export async function updateModel(id: string, data: Partial<Model>): Promise<void> {
  await axios.patch(`/models/${id}`, data)
}

export async function updateFilament(id: string, data: Partial<Filament>): Promise<void> {
  await axios.patch(`/filaments/${id}`, data)
}

export async function addFilament(data: Omit<Filament, 'id'>): Promise<Filament> {
  const res = await axios.post<Filament>('/filaments', data)
  return res.data
}
