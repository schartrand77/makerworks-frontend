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
      className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="
          backdrop-blur-xl 
          bg-white/20 
          dark:bg-zinc-900/20 
          shadow-xl 
          w-72 max-w-full p-4 
          rounded-full 
          flex flex-col items-center space-y-3
          border border-white/20 dark:border-zinc-700/30
        "
        onClick={(e) => e.stopPropagation()}
      >
        <a
          href="/settings"
          className="
            w-full text-center py-2 px-4 text-sm rounded-full
            backdrop-blur
            bg-white/20 dark:bg-zinc-800/30
            border border-white/20 dark:border-zinc-700/30
            text-gray-900 dark:text-gray-100
            shadow
            hover:bg-white/30 dark:hover:bg-zinc-700/50
            hover:shadow-md
            transition
          "
        >
          Account Settings
        </a>

        {isAdmin && (
          <a
            href="/admin"
            className="
              w-full text-center py-2 px-4 text-sm rounded-full
              backdrop-blur
              bg-red-500/20 dark:bg-red-700/30
              border border-red-500/30 dark:border-red-700/40
              text-red-800 dark:text-red-200
              shadow
              hover:bg-red-500/30 dark:hover:bg-red-700/50
              hover:shadow-md
              transition
            "
          >
            Admin Panel
          </a>
        )}

        {user && (
          <div
            className="
              mt-2 text-xs text-center text-gray-700 dark:text-gray-300 
              truncate max-w-[180px] px-2
            "
            title={user.email}
          >
            {user.email}
          </div>
        )}

        <button
          onClick={handleAuthClick}
          className="
            w-full py-2 px-4 text-sm rounded-full
            backdrop-blur
            bg-zinc-900/30 dark:bg-zinc-700/30
            border border-zinc-300/20 dark:border-zinc-600/30
            text-white
            shadow
            hover:bg-zinc-900/50 dark:hover:bg-zinc-700/50
            hover:shadow-md
            transition
          "
        >
          {user ? 'Sign Out' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}