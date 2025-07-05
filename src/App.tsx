// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { toast } from 'sonner' // ✅ add sonner or your preferred toast lib

// … [imports unchanged] …

import { useAuthStore } from '@/store/useAuthStore'

const isDev = import.meta.env.MODE === 'development'

// Debugging route changes
function RouteChangeLogger(): null {
  const location = useLocation()
  useEffect(() => {
    console.debug(`[Router] Navigated to ${location.pathname}`)
  }, [location])
  return null
}

// … [ProtectedAdminRoute & AnimatedRoutes unchanged] …

// 👇 God Mode Hotkey w/ toggle + toast + persist
function useGodModeHotkey() {
  const { godMode, setGodMode } = useAuthStore((s) => ({
    godMode: s.godMode,
    setGodMode: s.setGodMode,
  }))

  useEffect(() => {
    if (!isDev) return
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const isShortcut =
        (isMac && e.metaKey && e.shiftKey && e.key === 'G') ||
        (!isMac && e.ctrlKey && e.shiftKey && e.key === 'G')

      if (isShortcut) {
        e.preventDefault()
        const newState = !godMode
        setGodMode(newState)
        if (isDev) {
          localStorage.setItem('godMode', JSON.stringify(newState))
        }
        toast.success(
          newState
            ? '🚀 God Mode activated'
            : 'God Mode deactivated'
        )
        console.info(
          `[AuthStore] 🚀 God mode ${newState ? 'enabled' : 'disabled'} by hotkey`
        )
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [godMode, setGodMode])
}

const App: React.FC = () => {
  useEffect(() => {
    const fetch = async () => {
      console.debug('[App] Fetching user…')
      await useAuthStore.getState().fetchUser()
    }

    if (isDev) {
      const persistedGodMode = localStorage.getItem('godMode')
      if (persistedGodMode) {
        useAuthStore.getState().setGodMode(JSON.parse(persistedGodMode))
      }
    }

    fetch()
  }, [])

  if (isDev) {
    useGodModeHotkey()
  }

  return (
    <Router>
      <ModalProvider>
        <RouteChangeLogger />
        <Navbar />
        <main className="min-h-screen flex flex-col pt-20 liquid-bg text-zinc-900 dark:text-white">
          <AnimatedRoutes />
        </main>
      </ModalProvider>
    </Router>
  )
}

export default App