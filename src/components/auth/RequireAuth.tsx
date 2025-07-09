import { Navigate, useLocation } from 'react-router-dom'
import { ReactNode, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useDevModeStore } from '@/store/useDevModeStore'
import { RoutePaths } from '@/routes/RoutesRenderer'

interface RequireAuthProps {
  children: ReactNode
  adminOnly?: boolean
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, adminOnly = false }) => {
  const location = useLocation()
  const { user, isAuthenticated } = useAuthStore()
  const devMode = useDevModeStore((s) => s.enabled)

  useEffect(() => {
    console.debug('[RequireAuth] user:', user)
    console.debug('[RequireAuth] isAuthenticated:', isAuthenticated())
    console.debug('[RequireAuth] adminOnly:', adminOnly)
    console.debug('[RequireAuth] location:', location.pathname)
  }, [user, adminOnly, location.pathname])

  // Not authenticated → redirect to signin (unless dev mode)
  if (!devMode && (!isAuthenticated() || !user)) {
    console.warn('[RequireAuth] User not authenticated. Redirecting to signin.')
    return (
      <Navigate
        to={RoutePaths.signin}
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  // Authenticated but not admin → deny if adminOnly
  if (!devMode && adminOnly && user.role !== 'admin') {
    console.warn('[RequireAuth] User lacks admin privileges. Redirecting to landing.')
    return (
      <Navigate
        to={RoutePaths.landing}
        replace
        state={{ denied: true, from: location.pathname }}
      />
    )
  }

  // Authenticated & authorized
  return <>{children}</>
}
export default RequireAuth