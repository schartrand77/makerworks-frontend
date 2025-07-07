import { useLocation, NavLink } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useClickAway from '@/hooks/useClickAway'

const NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Browse', href: '/browse' },
  { label: 'Estimate', href: '/estimate' },
]

const DesktopNavbar = () => {
  const { pathname } = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const ref = useClickAway(() => setDropdownOpen(false))
  const user = useAuthStore((s) => s.user)

  const toggleTheme = () => {
    const html = document.documentElement
    const isDark = html.classList.toggle('dark')
    localStorage.theme = isDark ? 'dark' : 'light'
  }

  return (
    <nav className="w-full z-40 bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md shadow-sm border-b border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
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
              {label}
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
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              aria-controls="navbar-user-menu"
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
                  id="navbar-user-menu"
                  ref={ref}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-44 bg-white/90 dark:bg-zinc-900/90 border border-white/10 dark:border-white/20 shadow-xl rounded-xl p-2 z-50 backdrop-blur-sm"
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
      </div>
    </nav>
  )
}

export default DesktopNavbar