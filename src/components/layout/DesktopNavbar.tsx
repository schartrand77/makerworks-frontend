// src/components/layout/DesktopNavbar.tsx
import { useLocation, NavLink } from 'react-router-dom'
import { Sun, Moon, Shield, ShoppingCart, CreditCard } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore';
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useClickAway from '@/hooks/useClickAway'
// import { useCartStore } from '@/store/useCartStore' // optional if cart count

const NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Browse', href: '/browse' },
  { label: 'Estimate', href: '/estimate' },
  { label: 'Uploads', href: '/uploads' },
  { label: 'Cart', href: '/cart' },       // ✅ already present
  { label: 'Checkout', href: '/checkout' }, // ✅ added Checkout
]

const DesktopNavbar = () => {
  const { pathname } = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const ref = useClickAway(() => setDropdownOpen(false))
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'admin' || user?.isAdmin
  // const cartItems = useCartStore((s) => s.items) // optional if cart count

  const toggleTheme = () => {
    const html = document.documentElement
    const isDark = html.classList.toggle('dark')
    localStorage.theme = isDark ? 'dark' : 'light'
  }

  return (
    <nav className="flex justify-between items-center w-full">
      {/* Left: Nav Links */}
      <div className="flex gap-2">
        {NAV_LINKS.map(({ label, href }) => (
          <NavLink
            key={href}
            to={href}
            className={({ isActive }) =>
              `px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                isActive
                  ? 'bg-black/10 dark:bg-white/10 text-black dark:text-white'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300'
              }`
            }
          >
            {label === 'Cart' ? (
              <span className="flex items-center gap-1">
                <ShoppingCart className="w-4 h-4" />
                {label}
                {/* Uncomment below for cart count */}
                {/* {cartItems.length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1">
                    {cartItems.length}
                  </span>
                )} */}
              </span>
            ) : label === 'Checkout' ? (
              <span className="flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                {label}
              </span>
            ) : (
              label
            )}
          </NavLink>
        ))}
      </div>

      {/* Right: Theme Toggle & Avatar */}
      <div className="flex items-center gap-4">
        <button
          className="hover:scale-110 transition"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <Sun className="hidden dark:block w-5 h-5 text-yellow-300" />
          <Moon className="block dark:hidden w-5 h-5 text-zinc-700" />
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="w-8 h-8 rounded-full bg-zinc-300 dark:bg-zinc-700 overflow-hidden"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-semibold flex items-center justify-center h-full">
                {user?.username?.[0] ?? '?'}
              </span>
            )}
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                ref={ref}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 mt-2 w-44 bg-white dark:bg-zinc-900 border border-white/10 dark:border-white/20 shadow-xl rounded-xl p-2 z-50 backdrop-blur-sm"
              >
                <NavLink
                  to="/dashboard"
                  className="block px-4 py-2 rounded hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/settings"
                  className="block px-4 py-2 rounded hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Settings
                </NavLink>

                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className="flex items-center justify-between px-4 py-2 rounded hover:bg-black/5 dark:hover:bg-white/5 text-blue-600 dark:text-blue-400"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Admin
                    </div>
                    <span className="bg-blue-100 text-blue-600 text-[10px] px-1.5 py-0.5 rounded-full">
                      ADMIN
                    </span>
                  </NavLink>
                )}

                <button
                  onClick={() => {
                    useAuthStore.getState().logout()
                    window.location.href = '/'
                  }}
                  className="block w-full text-left px-4 py-2 rounded hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  )
}

export default DesktopNavbar