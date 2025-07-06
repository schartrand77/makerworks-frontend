import { useState } from "react"
import { useAuthStore } from "@/store/useAuthStore"

export const useSignOut = () => {
  const logout = useAuthStore((s) => s.logout)
  const [disabled, setDisabled] = useState(false)

  const signOut = () => {
    if (disabled) return

    console.info("[useSignOut] 🔒 Signing out…")
    setDisabled(true)

    logout()
    localStorage.removeItem("token")

    const AUTHENTIK_LOGOUT_URL =
      import.meta.env.VITE_AUTHENTIK_LOGOUT_URL?.trim() ||
      "https://authentik.yourdomain.com/if/session-end/"

    console.info("[useSignOut] Redirecting to:", AUTHENTIK_LOGOUT_URL)
    window.location.href = AUTHENTIK_LOGOUT_URL
  }

  return {
    disabled,
    signOut,
  }
}
