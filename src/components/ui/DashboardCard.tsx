import { Link, useLocation } from 'react-router-dom'
import UserDropdown from '@/components/ui/UserDropdown'
import { useAuthStore } from '@/store/useAuthStore'
import { useTheme } from '@/hooks/useTheme'

const GlassNavbar = () => {
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  const isDark = theme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  const navRoutes = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/browse', label: 'Browse' },
    { path: '/estimate', label: 'Estimate' },
    { path: '/upload', label: 'Upload' },
    { path: '/cart', label: 'Cart' },
    { path: '/checkout', label: 'Checkout' },
  ]

  return (
    <nav
      className={`
        fixed
        top-4
        left-1/2
        transform -translate-x-1/2
        flex justify-between items-center
        gap-6
        px-6 py-2
        rounded-full
        bg-white/30 dark:bg-black/30
        backdrop-blur-md
        shadow-md
        z-50
      `}
    >
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="text-lg font-bold text-gray-800 dark:text-white"
        >
          MakerWorks
        </Link>

        {navRoutes.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              text-sm
              px-3 py-1
              rounded-full
              shadow
              transition
              ${
                location.pathname === item.path
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/70 dark:bg-black/50 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700'
              }
            `}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {/* iPhone‑style Theme Toggle with icons & shadow */}
        <div className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
          🌞
          <button
            onClick={toggleTheme}
            className={`
              w-12 h-6 rounded-full p-0.5 flex items-center
              transition-colors duration-300 relative
              ${isDark
                ? 'bg-zinc-700/50 justify-end'
                : 'bg-green-300/50 justify-start'}
              backdrop-blur
              border border-white/20 dark:border-zinc-700/30
              shadow-md
            `}
            aria-label="Toggle theme"
          >
            <span
              className="
                w-5 h-5 rounded-full bg-white shadow
                transform transition-transform duration-300
              "
            ></span>
          </button>
          🌙
        </div>

        {isAuthenticated() ? (
          <UserDropdown user={user} />
        ) : (
          <Link
            to="/auth/signin"
            className="
              px-4 py-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition shadow
            "
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}

export default GlassNavbar