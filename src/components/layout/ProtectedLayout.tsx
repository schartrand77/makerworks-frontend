import { useEffect, ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '@/hooks/useUser'
import PageLayout from '@/components/layout/PageLayout'

interface ProtectedLayoutProps {
  children: ReactNode
  role?: string
}

export default function ProtectedLayout({ children, role }: ProtectedLayoutProps) {
  const { user, isAuthenticated, loading, hasRole } = useUser()
  const location = useLocation()

  useEffect(() => {
    console.debug('[ProtectedLayout] mount', {
      user,
      loading,
      authed: isAuthenticated(),
    })
  }, [user, loading])

  if (loading) {
    return (
      <PageLayout title="Loading">
        <p className="text-muted-foreground">Loading user session…</p>
      </PageLayout>
    )
  }

  if (!isAuthenticated()) {
    console.warn('[ProtectedLayout] Unauthorized, redirecting')
    return <Navigate to="/auth/signin" state={{ from: location }} replace />
  }

  if (role && !hasRole(role)) {
    console.warn(`[ProtectedLayout] Insufficient role: ${role}`)
    return (
      <PageLayout title="Forbidden">
        <p className="text-red-600 dark:text-red-400">
          You do not have permission to access this page.
        </p>
      </PageLayout>
    )
  }

  return <>{children}</>
}
