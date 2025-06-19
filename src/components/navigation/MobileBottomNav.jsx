// src/components/MobileBottomNav.jsx
import { Home, FolderOpen, ShoppingCart, Star, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const tabs = [
  { to: '/', icon: <Home size={20} />, label: 'Home' },
  { to: '/browse', icon: <FolderOpen size={20} />, label: 'Browse' },
  { to: '/cart', icon: <ShoppingCart size={20} />, label: 'Cart' },
  { to: '/favorites', icon: <Star size={20} />, label: 'Favorites' },
  { to: '/account', icon: <User size={20} />, label: 'Me' },
]

export default function MobileBottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="glass-bottom-nav">
      {tabs.map(({ to, icon, label }) => {
        const isActive = pathname === to
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center justify-center gap-0.5 text-xs transition-all ${
              isActive ? 'text-white font-semibold' : 'text-white/60'
            }`}
          >
            {icon}
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}