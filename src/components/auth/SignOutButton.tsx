import { useSignOut } from "@/hooks/useSignOut"

type SignOutButtonProps = {
  className?: string
}

/**
 * Logs the user out from the frontend and redirects them to Authentik's logout URL.
 * Uses useSignOut() hook for logic.
 */
export default function SignOutButton({ className = "" }: SignOutButtonProps) {
  const { disabled, signOut } = useSignOut()

  return (
    <button
      onClick={signOut}
      disabled={disabled}
      className={`px-4 py-2 text-sm rounded-xl bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition text-zinc-800 dark:text-white disabled:opacity-50 ${className}`}
    >
      {disabled ? "Signing out…" : "Sign Out"}
    </button>
  )
}