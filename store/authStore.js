// src/store/authStore.js
import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    set({ user, token })
  },
  clearAuth: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },
}))