import React, { useState } from 'react'
import { useUser } from '@/hooks/useUser'
import MobileDrawer from '@/components/ui/MobileDrawer'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { useLocation } from 'react-router-dom'

interface GlassNavbarProps {
  floating?: boolean
}

export default function GlassNavbar({ floating = true }: GlassNavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user, isAdmin } = useUser()
  const location = useLocation()

  const toggleDrawer = () => setDrawerOpen(!drawerOpen)

  const tabs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Browse', href: '/browse' },
    { label: 'Upload', href: '/upload' },
    { label: 'Cart', href: '/cart' },
  ]

  return (
    <>
      <div
        className={
          floating
            ? 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4'
            : 'w-full px-4 bg-white dark:bg-zinc-800 shadow'
        }
      >
        <nav
          className={`${
            floating
              ? 'backdrop-blur-md bg-white/30 dark:bg-zinc-800/30 border border-white/20 dark:border-zinc-700/50 shadow-xl rounded-full'
              : 'bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700'
          } flex items-center justify-between px-4 py-2`}
        >
          <div className="flex items-center space-x-3">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.href
              return (
                <a
                  key={tab.href}
                  href={tab.href}
                  className={`px-3 py-1 text-sm rounded-full backdrop-blur border transition
                    ${isActive
                      ? 'bg-white/40 dark:bg-zinc-700/50 border-white/30 dark:border-zinc-600/50 text-zinc-900 dark:text-white font-medium'
                      : 'bg-white/20 dark:bg-zinc-700/30 border-white/20 dark:border-zinc-700/50 text-zinc-800 dark:text-white hover:bg-white/30 dark:hover:bg-zinc-700/50'}`}
                >
                  {tab.label}
                </a>
              )
            })}
          </div>

          <ThemeToggle />
          <button
            onClick={toggleDrawer}
            className="ml-4 focus:outline-none"
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.username}
                className="w-8 h-8 rounded-full border border-white shadow"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-zinc-400 text-white flex items-center justify-center text-sm font-medium">
                {user?.username?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
          </button>
        </nav>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          <a
            href="/settings"
            className="block text-sm hover:underline"
          >
            Account Settings
          </a>
          {isAdmin && (
            <a
              href="/admin"
              className="block text-sm hover:underline text-red-500"
            >
              Admin Panel
            </a>
          )}
          <button
            onClick={() => setDrawerOpen(false)}
            className="mt-4 px-4 py-2 backdrop-blur bg-white/20 dark:bg-zinc-700/30 border border-white/20 dark:border-zinc-700/50 text-white rounded-full hover:bg-white/30 dark:hover:bg-zinc-700/50 transition"
          >
            Close
          </button>
        </div>
      </MobileDrawer>
    </>
  )
}