// src/store/themeStore.js
import { create } from 'zustand'

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

export const useThemeStore = create((set) => {
  const stored = localStorage.getItem('theme')
  const initial = stored ? stored === 'dark' : prefersDark
  document.documentElement.classList.toggle('dark', initial)

  return {
    darkMode: initial,
    toggleTheme: () =>
      set((state) => {
        const next = !state.darkMode
        document.documentElement.classList.toggle('dark', next)
        localStorage.setItem('theme', next ? 'dark' : 'light')
        return { darkMode: next }
      }),
  }
})