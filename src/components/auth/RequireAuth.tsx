// src/components/auth/RequireAuth.tsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect, useState } from 'react'

/**
 * Guards a route, redirecting unauthenticated users to fallback
 * and unauthorized users (wrong role) to /unauthorized.
 */
const RequireAuth = ({
  children,
  requiredRoles,
  fallbackTo = '/', // fallback for unauthenticated
}: {
  children: JSX.Element
  requiredRoles?: string[]
  fallbackTo?: string
}) => {
  const { isAuthenticated, user, resolved, fetchUser } = useAuthStore()
  const location = useLocation()
  const [checking, setChecking] = useState(!resolved)

  useEffect(() => {
    if (!resolved) {
      fetchUser().finally(() => setChecking(false))
    } else {
      setChecking(false)
    }
  }, [resolved, fetchUser])

  if (checking) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-sm text-gray-400">
        <span>🔐 Checking authentication...</span>
      </div>
    )
  }

  if (!isAuthenticated()) {
    console.info(
      '[RequireAuth] User is not authenticated → redirecting to fallback.',
      { fallbackTo, from: location.pathname }
    )
    return <Navigate to={fallbackTo} state={{ from: location }} replace />
  }

  const userRole = user?.role

  if (
    requiredRoles &&
    (!userRole || !requiredRoles.includes(userRole))
  ) {
    console.info(
      `[RequireAuth] Authenticated but role "${userRole}" not in [${requiredRoles.join(
        ', '
      )}] → redirecting to /unauthorized.`,
      { from: location.pathname }
    )
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}

export default RequireAuth
