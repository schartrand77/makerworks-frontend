// src/store/themeStore.js
import { create } from 'zustand'

// Utility to safely check localStorage in all environments
const getInitialTheme = () => {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('darkMode')
    return stored ? JSON.parse(stored) : window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

const applyThemeClass = (isDark) => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', isDark)
  }
}

const useThemeStore = create((set) => {
  const initialDarkMode = getInitialTheme()
  applyThemeClass(initialDarkMode)

  return {
    darkMode: initialDarkMode,
    toggleDarkMode: () =>
      set((state) => {
        const next = !state.darkMode
        localStorage.setItem('darkMode', JSON.stringify(next))
        applyThemeClass(next)
        return { darkMode: next }
      }),
  }
})

export default useThemeStore