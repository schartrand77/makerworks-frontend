import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { useThemeStore } from '../store/themeStore'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiShoppingCart } from 'react-icons/fi'

export default function MobileDrawer() {
  const [open, setOpen] = useState(false)
  const { user, clearAuth } = useAuthStore()
  const { cartItems } = useCartStore()
  const { darkMode, toggleTheme } = useThemeStore()
  const navigate = useNavigate()
  const location = useLocation()
  const drawerRef = useRef()

  const initials = user?.username?.slice(0, 2).toUpperCase() || 'MW'

  const handleSignOut = () => {
    clearAuth()
    navigate('/signin')
  }

  // Close drawer on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (open && drawerRef.current && !drawerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const linkClass = (path) =>
    `hover:underline ${
      location.pathname === path ? 'text-blue-400 font-bold' : ''
    }`

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 w-full flex items-center justify-between bg-white/10 backdrop-blur-md p-4 z-50 border-b border-white/10">
        <button onClick={() => setOpen(true)} className="text-white text-2xl">
          <FiMenu />
        </button>
        <h1 className="text-lg font-bold text-white">MakerWorks</h1>
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative text-white text-xl">
            <FiShoppingCart />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {cartItems.length}
              </span>
            )}
          </Link>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white font-semibold">
            {initials}
          </div>
        </div>
      </div>

      {/* Slide-out drawer from right */}
      <AnimatePresence>
        {open && (
          <motion.aside
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed top-0 right-0 w-64 h-full bg-black/90 text-white z-50 p-6 shadow-xl flex flex-col gap-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Menu</h2>
              <button onClick={() => setOpen(false)} className="text-2xl">
                <FiX />
              </button>
            </div>

            <Link to="/" onClick={() => setOpen(false)} className={linkClass('/')}>Home</Link>
            <Link to="/browse" onClick={() => setOpen(false)} className={linkClass('/browse')}>Browse</Link>
            <Link to="/upload" onClick={() => setOpen(false)} className={linkClass('/upload')}>Upload</Link>
            <Link to="/dashboard" onClick={() => setOpen(false)} className={linkClass('/dashboard')}>Dashboard</Link>
            <Link to="/settings" onClick={() => setOpen(false)} className={linkClass('/settings')}>Settings</Link>
            <Link to="/cart" onClick={() => setOpen(false)} className={linkClass('/cart')}>Cart</Link>

            <button
              onClick={toggleTheme}
              className="mt-4 px-3 py-2 bg-white/10 rounded text-sm"
            >
              Toggle {darkMode ? 'Light' : 'Dark'} Mode
            </button>

            <button
              onClick={handleSignOut}
              className="mt-auto px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Sign Out
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}