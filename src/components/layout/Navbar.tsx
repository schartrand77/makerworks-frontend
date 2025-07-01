import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Browse', path: '/browse' },
  { label: 'Upload', path: '/upload' },
  { label: 'Estimate', path: '/estimate' },
  { label: 'Dashboard', path: '/dashboard' },
]

const Navbar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  const handleLogout = (): void => {
    logout()
    navigate('/auth/signin')
  }

  // Close dropdown on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-300/20 dark:border-zinc-800/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Title */}
        <Link to="/" className="text-xl font-semibold tracking-tight text-primary">
          MakerWorks
        </Link>

        {/* Center nav items */}
        <nav className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition',
                location.pathname.startsWith(item.path)
                  ? 'bg-zinc-900/90 text-white dark:bg-white/10'
                  : 'text-zinc-600 hover:bg-zinc-300/30 dark:text-zinc-300 dark:hover:bg-zinc-700/30'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side avatar / Signin */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden"
            >
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-semibold uppercase text-zinc-700 dark:text-zinc-100">
                  {user.username?.[0] ?? '?'}
                </span>
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl shadow-xl backdrop-blur bg-white/80 dark:bg-zinc-800/80 border border-zinc-300/30 dark:border-zinc-700/50 py-2 z-50">
                <div className="px-3 py-2 text-xs font-medium text-zinc-500">
                  Signed in as
                  <span className="block truncate text-zinc-700 dark:text-zinc-200">
                    {user.username}
                  </span>
                </div>
                <hr className="border-zinc-200 dark:border-zinc-700 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 text-red-600"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/auth/signin"
            className="text-sm font-medium text-primary hover:underline"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  )
}

export default Navbar