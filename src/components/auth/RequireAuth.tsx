import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'

/**
 * RequireAuth — protects routes and allows either:
 * - Normal authenticated session
 * - Or God Mode (via Konami code)
 *
 * Redirects to /auth/signin if neither is present.
 */
export default function RequireAuth() {
  const auth = useAuthStore()
  const location = useLocation()

  const allowed =
    auth.isAuthenticated() || auth.isGodMode()

  if (!allowed) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />
  }

  return <Outlet />
}