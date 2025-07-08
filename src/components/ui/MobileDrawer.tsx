import React from 'react'
import { useUser } from '@/hooks/useUser'
import { useSignOut } from '@/hooks/useSignOut'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const { user, isAdmin } = useUser()
  const { signOut } = useSignOut()

  if (!open) return null

  const handleAuthClick = () => {
    if (user) {
      signOut()
    } else {
      window.location.href = '/auth/signin'
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex justify-end"
      onClick={onClose}
    >
      <div
        className="backdrop-blur-md bg-white/30 dark:bg-zinc-800/30 border-l border-white/20 dark:border-zinc-700/50 shadow-2xl w-64 h-full p-4 rounded-l-3xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-3">
          <a
            href="/settings"
            className="block w-full text-center py-2 text-sm rounded-full backdrop-blur bg-white/20 dark:bg-zinc-700/30 border border-white/20 dark:border-zinc-700/50 hover:bg-white/30 dark:hover:bg-zinc-700/50 transition"
          >
            Account Settings
          </a>

          {isAdmin && (
            <a
              href="/admin"
              className="block w-full text-center py-2 text-sm rounded-full backdrop-blur bg-red-500/20 dark:bg-red-700/30 border border-red-300/20 dark:border-red-700/50 hover:bg-red-500/30 dark:hover:bg-red-700/50 text-red-800 dark:text-red-200 transition"
            >
              Admin Panel
            </a>
          )}
        </div>

        <button
          onClick={handleAuthClick}
          className="mt-6 w-full py-2 text-sm rounded-full backdrop-blur bg-zinc-900/40 dark:bg-zinc-700/40 border border-zinc-300/20 dark:border-zinc-600/50 text-white hover:bg-zinc-900/60 dark:hover:bg-zinc-700/60 transition"
        >
          {user ? 'Sign Out' : 'Sign In'}
        </button>
      </div>
    </div>
  )}