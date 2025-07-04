// src/components/layout/MobileDrawer.tsx
import { NAV_LINKS } from '@/config/navConfig'
import { useState } from 'react'
import { Menu, X, Shield } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/useAuthStore'

const MobileDrawer = () => {
  const [open, setOpen] = useState(false)
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'admin' || user?.isAdmin

  return (
    <div className="w-full flex justify-between items-center">
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition"
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex flex-col
              backdrop-blur-2xl
              bg-gradient-to-br
              from-white/70 to-white/40
              dark:from-zinc-900/80 dark:to-zinc-800/60
              border-l border-white/10 dark:border-white/20
              text-zinc-900 dark:text-zinc-100
              px-6 py-8 shadow-2xl transition-colors duration-300"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Navigation
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map(({ label, href }) => (
                <NavLink
                  key={href}
                  to={href}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `text-base font-medium rounded-full px-4 py-2 transition-all ${
                      isActive
                        ? 'bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-white'
                        : 'text-zinc-700 dark:text-white hover:bg-black/5 dark:hover:bg-white/5'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              {/* Uploads explicitly if not in NAV_LINKS */}
              <NavLink
                to="/uploads"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-base font-medium rounded-full px-4 py-2 transition-all ${
                    isActive
                      ? 'bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-white'
                      : 'text-zinc-700 dark:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`
                }
              >
                Uploads
              </NavLink>

              {/* Admin link if admin */}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between text-base font-medium rounded-full px-4 py-2 transition-all ${
                      isActive
                        ? 'bg-black/10 dark:bg-white/10 text-blue-600 dark:text-blue-300'
                        : 'text-blue-600 dark:text-blue-300 hover:bg-black/5 dark:hover:bg-white/5'
                    }`
                  }
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
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MobileDrawer