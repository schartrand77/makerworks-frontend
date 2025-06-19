import { useEffect, Suspense, lazy } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { Toaster, ToastBar } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/useAuthStore'
import { useDrawerStore } from '@/store/drawerStore'
import MobileDrawer from '@/components/navigation/MobileDrawer'

import AnimatedRoutes from '@/components/AnimatedRoutes'

// Lazy-loaded pages
const Landing = lazy(() => import('@/pages/Landing'))
const AuthPage = lazy(() => import('@/components/Auth/SignIn'))
const SignOut = lazy(() => import('@/pages/SignOut'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Upload = lazy(() => import('@/pages/Upload'))
const Browse = lazy(() => import('@/pages/Browse'))
const Estimate = lazy(() => import('@/pages/Estimate'))
const Cart = lazy(() => import('@/pages/Cart'))
const Checkout = lazy(() => import('@/pages/Checkout'))
const Admin = lazy(() => import('@/pages/Admin'))
const Settings = lazy(() => import('@/pages/Settings'))

const RequireAuth = lazy(() => import('@/components/Auth/RequireAuth'))
const RequireAdmin = lazy(() => import('@/components/Auth/RequireAdmin'))

function App() {
  const fetchUser = useAuthStore((s) => s.fetchUser)
  const location = useLocation()
  const navigationType = useNavigationType()
  const direction = navigationType === 'POP' ? -1 : 1

  const { isDrawerOpen, closeDrawer } = useDrawerStore()

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white/80 to-slate-100 dark:from-[#101010] dark:to-[#050505] text-white">
      {/* Minimal Toasts */}
      <Toaster position="bottom-right" gutter={12}>
        {(t) => (
          <AnimatePresence>
            {t.visible && (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.3 }}
              >
                <ToastBar toast={t}>
                  {({ message }) => (
                    <div
                      className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium
                        ${
                          t.type === 'success'
                            ? 'bg-green-100 text-green-800'
                            : t.type === 'error'
                            ? 'bg-red-100 text-red-800'
                            : t.type === 'loading'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      <span>
                        {t.type === 'success' && '✅'}
                        {t.type === 'error' && '⚠️'}
                        {t.type === 'loading' && '⏳'}
                        {t.type === 'blank' && 'ℹ️'}
                      </span>
                      <span>{message}</span>
                    </div>
                  )}
                </ToastBar>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Toaster>

      {/* Global Mobile Drawer */}
      {isDrawerOpen && <MobileDrawer onClose={closeDrawer} />}

      <main className="flex-1 flex flex-col">
        <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
          <AnimatedRoutes location={location} direction={direction} />
        </Suspense>
      </main>
    </div>
  )
}

export default App