import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/useAuthStore'
import useThemeStore from '@/store/themeStore'
import { useDrawerStore } from '@/store/drawerStore'
import { useEffect } from 'react'
import { FiShoppingCart, FiGrid } from 'react-icons/fi'
import { Home, FileText } from 'lucide-react'

export default function DesktopNavbar() {
  const { cartItems } = useCartStore()
  const { user, isLoading, fetchUser } = useAuthStore()
  const { darkMode } = useThemeStore()
  const { toggleDrawer } = useDrawerStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    fetchUser()
  }, [])

  const initials = user?.username?.slice(0, 2).toUpperCase() || 'MW'

  const linkClass = (path) =>
    `glass-tab-pill px-3 py-1 flex items-center gap-2 text-sm ${
      location.pathname === path ? 'active font-semibold' : ''
    }`

  if (isLoading) return null

  return (
    <nav className="glass-navbar fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 py-2 h-[52px] flex justify-between items-center rounded-full">
      {/* Left nav */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard">
          <div className={linkClass('/dashboard')}>
            <Home size={18} />
            <span className="hidden md:inline">Home</span>
          </div>
        </Link>
        <Link to="/browse" className={linkClass('/browse')}>
          <FiGrid size={18} />
          <span className="hidden md:inline">Browse</span>
        </Link>
        <Link to="/estimates" className={linkClass('/estimates')}>
          <FileText size={18} />
          <span className="hidden md:inline">Estimates</span>
        </Link>
      </div>

      {/* Spacer */}
      <div className="flex-grow" />

      {/* Right nav */}
      <div className="flex items-center gap-4 relative">
        <Link to="/cart" className="relative glass-tab-pill px-3 py-1">
          <FiShoppingCart size={18} />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1">
              {cartItems.length}
            </span>
          )}
        </Link>

        {/* Avatar triggers MobileDrawer */}
        <button
          onClick={toggleDrawer}
          className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center font-bold ring-1 ring-white/10 hover:ring-white/20 transition"
        >
          {initials}
        </button>
      </div>
    </nav>
  )
}