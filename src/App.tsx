// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'

// Pages
import Landing from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'
import Browse from '@/pages/Browse'
import Uploads from '@/pages/Uploads'
import Estimate from '@/pages/Estimate'
import Admin from '@/pages/Admin'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'     // ✅ added
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

// Auth store
import { useAuthStore } from '@/store/auth'

// Debugging route changes
function RouteChangeLogger(): null {
  const location = useLocation()
  useEffect(() => {
    console.debug(`[Router] Navigated to ${location.pathname}`)
  }, [location])
  return null
}

// Protect admin route
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((s) => s.user)

  if (!user || (user.role !== 'admin' && !user.isAdmin)) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">
        <div className="bg-white/60 dark:bg-zinc-800/60 p-6 rounded-xl shadow-xl backdrop-blur">
          <h1 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Access Denied
          </h1>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            You must be an administrator to view this page.
          </p>
        </div>
      </main>
    )
  }

  return <>{children}</>
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/uploads" element={<Uploads />} />
        <Route path="/estimate" element={<Estimate />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />       {/* ✅ added */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <Admin />
            </ProtectedAdminRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
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
        <main className="min-h-screen flex flex-col pt-20 liquid-bg text-zinc-900 dark:text-white">
          <AnimatedRoutes />
        </main>
      </ModalProvider>
    </Router>
  )
}

export default App