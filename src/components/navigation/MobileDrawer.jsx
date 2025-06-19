import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useCartStore } from '@/store/cartStore'
import useThemeStore from '@/store/themeStore'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'

export default function MobileDrawer() {
  const [open, setOpen] = useState(true)
  const drawerRef = useRef()
  const navigate = useNavigate()
  const location = useLocation()

  const { cartItems } = useCartStore()
  const { darkMode, toggleTheme } = useThemeStore()
  const { user, isLoading, fetchUser, signOut } = useAuthStore()

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (open && drawerRef.current && !drawerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const initials = user?.username?.slice(0, 2).toUpperCase() || 'MW'

  const linkClass = (path) =>
    `hover:underline ${location.pathname === path ? 'text-blue-400 font-bold' : ''}`

  const handleSignOut = () => {
    signOut()
    navigate('/signin')
  }

  if (isLoading || !open) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          ref={drawerRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed top-20 right-4 w-64 bg-white/10 backdrop-blur-xl text-white z-50 p-6 rounded-2xl shadow-2xl ring-1 ring-white/20 flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Profile</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-2xl text-white"
              aria-label="Close menu"
              role="button"
            >
              <FiX />
            </button>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-4 px-1 py-3 mb-2 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/10 shadow-inner">
            <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-semibold ring-1 ring-white/20">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">{user?.username || 'Guest'}</span>
              <span className="text-xs text-gray-300">{user?.email || 'guest@example.com'}</span>
            </div>
          </div>

          {/* Cart */}
          <Link to="/cart" onClick={() => setOpen(false)} className={linkClass('/cart')}>
            Cart
            {cartItems.length > 0 && (
              <span className="ml-2 inline-block bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Settings */}
          <Link to="/settings" onClick={() => setOpen(false)} className={linkClass('/settings')}>
            Settings
          </Link>

          {/* Admin (if admin user) */}
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setOpen(false)} className={linkClass('/admin')}>
              Admin
            </Link>
          )}

          {/* Theme toggle */}
          <div className="flex items-center justify-between mt-6 mb-2">
            <span className="text-sm">Theme</span>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition"
            >
              {darkMode ? 'Dark' : 'Light'}
            </button>
          </div>

          {/* Sign Out */}
          <button
  onClick={handleSignOut}
  className="mt-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium backdrop-blur-sm hover:bg-white/20 transition shadow-inner ring-1 ring-white/10"
>
  Sign Out
</button>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}