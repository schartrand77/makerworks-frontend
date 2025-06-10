// src/store/useThemeStore.js
import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: 'system', // 'light' | 'dark' | 'system'
  setTheme: (theme) => {
    set({ theme })
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', prefersDark)
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
    localStorage.setItem('theme', theme)
  },
  initTheme: () => {
    const saved = localStorage.getItem('theme') || 'system'
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', saved === 'dark' || (saved === 'system' && prefersDark))
    set({ theme: saved })
  }
}))