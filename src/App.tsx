// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

// Pages
import Landing from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'
import Upload from '@/pages/Upload'
import Estimate from '@/pages/Estimate'
import NotFound from '@/pages/NotFound'

// Auth module
import {
  SignIn,
  SignUp,
  AuthCallback,
} from '@/components/auth'

// Context
import { ModalProvider } from '@/context/ModalProvider'

// Global layout
import Navbar from '@/components/layout/Navbar'

// Auth store (mock user dev support)
import { useAuthStore } from '@/store/useAuthStore'

// Debugging route changes
function RouteChangeLogger(): null {
  const location = useLocation()
  useEffect(() => {
    console.debug(`[Router] Navigated to ${location.pathname}`)
  }, [location])
  return null
}

const App: React.FC = () => {
  useEffect(() => {
    const fetch = async () => {
      console.debug('[App] Fetching user...')
      await useAuthStore.getState().fetchUser()
    }
    fetch()
  }, [])

  return (
    <Router>
      <ModalProvider>
        <RouteChangeLogger />
        <Navbar />
        <main className="min-h-screen flex flex-col pt-20 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth/signin" element={<SignIn />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/estimate" element={<Estimate />} />

            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </ModalProvider>
    </Router>
  )
}

export default App