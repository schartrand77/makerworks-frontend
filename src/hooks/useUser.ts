// src/hooks/useUser.ts
import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

export const useUser = () => {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const resolved = useAuthStore((s) => s.resolved)
  const isAuthenticatedFn = useAuthStore((s) => s.isAuthenticated)
  const hasRoleFn = useAuthStore((s) => s.hasRole)
  const fetchUser = useAuthStore((s) => s.fetchUser)

  const isAdmin = hasRoleFn?.('admin') ?? false
  const isUser = hasRoleFn?.('user') ?? false

  useEffect(() => {
    if (!resolved && !loading) {
      console.debug('[useUser] Hydrating user via fetchUser()...')
      fetchUser?.().catch((err) =>
        console.warn('[useUser] fetchUser() failed:', err)
      )
    }
  }, [resolved, loading, fetchUser])

  return {
    user,
    userId: user?.id,
    loading,
    resolved,
    isAuthenticated: isAuthenticatedFn?.() ?? false,
    isAdmin,
    isUser,
  }
}