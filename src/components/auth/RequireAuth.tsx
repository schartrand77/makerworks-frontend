// src/components/auth/RequireAuth.tsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect, useState } from 'react'

interface RequireAuthProps {
  children: JSX.Element
  requiredRoles?: string[]
  fallbackTo?: string
}

/**
 * Guards routes and prevents infinite redirect loops by waiting
 * until Zustand is fully hydrated before redirecting.
 */
const RequireAuth = ({
  children,
  requiredRoles,
  fallbackTo = '/auth/signin'
}: RequireAuthProps) => {
  const { isAuthenticated, user, resolved, fetchUser } = useAuthStore()
  const location = useLocation()
  const [checking, setChecking] = useState(!resolved)

  useEffect(() => {
    let active = true
    if (!resolved) {
      fetchUser().finally(() => active && setChecking(false))
    } else {
      setChecking(false)
    }
    return () => { active = false }
  }, [resolved, fetchUser])

  // ✅ Block render until hydration resolves
  if (checking || !resolved) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-sm text-gray-400">
        <span>🔐 Checking authentication...</span>
      </div>
    )
  }

  // ✅ Only redirect if fully resolved and definitely not authenticated
  if (!isAuthenticated()) {
    console.info('[RequireAuth] Not authenticated, redirecting', { from: location.pathname })
    return <Navigate to={fallbackTo} state={{ from: location }} replace />
  }

  // ✅ Optional role-based guard
  const userRole = user?.role
  if (requiredRoles && (!userRole || !requiredRoles.includes(userRole))) {
    console.info(
      `[RequireAuth] Authenticated but role "${userRole}" not in [${requiredRoles.join(', ')}], redirecting to /unauthorized`
    )
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default RequireAuth
