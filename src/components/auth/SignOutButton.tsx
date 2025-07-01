import { useAuthStore } from '@/store/useAuthStore'

type SignOutButtonProps = {
  className?: string
}

/**
 * Logs the user out from the frontend and redirects them to Authentik's logout URL.
 * Supports optional className override for styling.
 */
export default function SignOutButton({ className = '' }: SignOutButtonProps) {
  const logout = useAuthStore((s) => s.logout)

  const handleSignOut = (): void => {
    console.debug('[SignOutButton] Logging out…')
    logout()

    const AUTHENTIK_LOGOUT_URL =
      import.meta.env.VITE_AUTHENTIK_LOGOUT_URL ||
      'https://authentik.yourdomain.com/if/session-end/'

    window.location.href = AUTHENTIK_LOGOUT_URL
  }

  return (
    <button
      onClick={handleSignOut}
      className={`px-4 py-2 text-sm rounded-xl bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition text-zinc-800 dark:text-white ${className}`}
    >
      Sign Out
    </button>
  )
}