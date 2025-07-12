import axios from "./axios";

/**
 * TYPES
 */

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  banned?: boolean;
}

export interface Model {
  id: string;
  name: string;
  description?: string;
}

export interface Filament {
  id: string;
  name: string;
  type: string;
  subtype?: string;
  surface?: string;
  texture?: string;
  colorHex?: string;
  colorName?: string;
  pricePerKg: number;
  currency: string;
  description?: string;
  is_active?: boolean;
  is_biodegradable?: boolean;
}

/**
 * USERS
 */

export async function fetchAllUsers(): Promise<AdminUser[]> {
  const res = await axios.get<AdminUser[]>("/admin/admin/users");
  return res.data;
}

export async function banUser(userId: string): Promise<void> {
  await axios.post(`/admin/admin/users/${userId}/demote`);
}

export async function promoteUser(userId: string): Promise<void> {
  await axios.post(`/admin/admin/users/${userId}/promote`);
}

export async function deleteUser(userId: string): Promise<void> {
  await axios.delete(`/admin/admin/users/${userId}`);
}

export async function resetPassword(userId: string): Promise<void> {
  await axios.post(`/admin/admin/users/${userId}/reset-password`);
}

/**
 * MODELS
 */

export async function fetchAllModels(): Promise<Model[]> {
  const res = await axios.get<Model[]>("/models");
  return res.data;
}

export async function updateModel(id: string, data: Partial<Model>): Promise<Model> {
  const res = await axios.patch<Model>(`/models/${id}`, data);
  return res.data;
}

/**
 * FILAMENTS
 */

export async function fetchAvailableFilaments(): Promise<Filament[]> {
  const res = await axios.get<Filament[]>("/filaments/");
  return res.data;
}

export async function addFilament(data: Omit<Filament, "id">): Promise<Filament> {
  const res = await axios.post<Filament>("/filaments/", data);
  return res.data;
}

export async function updateFilament(id: string, data: Partial<Omit<Filament, "id">>): Promise<Filament> {
  const res = await axios.put<Filament>(`/filaments/${id}`, data);
  return res.data;
}

export async function deleteFilament(id: string): Promise<void> {
  await axios.delete(`/filaments/${id}`);
}