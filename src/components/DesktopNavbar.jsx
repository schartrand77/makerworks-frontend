import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingCart } from 'react-icons/fi'

export default function DesktopNavbar() {
  const { cartItems } = useCartStore()
  const { user, clearAuth } = useAuthStore()
  const { darkMode, toggleTheme } = useThemeStore()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const initials = user?.username?.slice(0, 2).toUpperCase() || 'MW'

  const handleSignOut = () => {
    clearAuth()
    navigate('/signin')
  }

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl px-6 py-3 bg-white/10 dark:bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-between">
      <div className="flex items-center gap-6 text-white">
        <Link to="/" className="font-bold text-lg">MakerWorks</Link>
        <Link to="/browse" className="text-sm hover:underline">Browse</Link>
        <Link to="/upload" className="text-sm hover:underline">Upload</Link>
        <Link to="/dashboard" className="text-sm hover:underline">Dashboard</Link>
      </div>

      <div className="flex items-center gap-5 text-white relative">
        <button onClick={toggleTheme} className="text-xs px-2 py-1 rounded bg-white/10">
          {darkMode ? '☀︎' : '☾'}
        </button>

        <Link to="/cart" className="relative text-xl">
          <FiShoppingCart />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
              {cartItems.length}
            </span>
          )}
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-bold"
        >
          {initials}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-10 w-44 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-2 shadow-xl"
            >
              <p className="px-3 py-2 text-sm font-medium">{user?.username}</p>
              <hr className="border-white/20" />
              <Link to="/dashboard" className="block px-3 py-2 text-sm hover:bg-white/10 rounded">
                Dashboard
              </Link>
              <Link to="/settings" className="block px-3 py-2 text-sm hover:bg-white/10 rounded">
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/10 rounded"
              >
                Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}