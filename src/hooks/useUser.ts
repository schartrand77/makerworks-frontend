// src/hooks/useUser.ts
import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore';

export const useUser = () => {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const resolved = useAuthStore((s) => s.resolved)
  const isAuthenticatedFn = useAuthStore((s) => s.isAuthenticated)
  const hasRoleFn = useAuthStore((s) => s.hasRole)
  const fetchUser = useAuthStore((s) => s.fetchUser)

  const isAdmin =
    hasRoleFn?.('admin') || user?.groups?.includes('MakerWorks-Admin') || false

  const isUser =
    hasRoleFn?.('user') || user?.groups?.includes('MakerWorks-User') || false

  useEffect(() => {
    if (!resolved && !loading) {
      console.debug('[useUser] Hydrating user via fetchUser()...')
      fetchUser?.().catch((err) =>
        console.warn('[useUser] fetchUser() failed:', err)
      )
    }
  }, [resolved, loading, fetchUser])

  if (user && (!Array.isArray(user.groups) || user.groups.length === 0)) {
    console.warn('[useUser] User has no groups assigned:', user)
  }

  return {
    user,
    userId: user?.id,
    loading,
    resolved,
    isAuthed: isAuthenticatedFn?.() ?? false,
    isAuthenticated: isAuthenticatedFn?.() ?? false,
    hasRole: hasRoleFn,
    isAdmin,
    isUser,
  }
}
