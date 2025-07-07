import { useEffect } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import DashboardCard from '@/components/ui/DashboardCard'
import UserDashboardCard from '@/components/ui/UserDashboardCard'
import { useUser } from '@/hooks/useUser'
import { Star, Upload, Shield } from 'lucide-react'

interface DashboardCardProps {
  to: string
}

const Dashboard: React.FC = () => {
  const { user, isAdmin, loading } = useUser()

  useEffect(() => {
    const mountTime = performance.now()
    console.debug('[Dashboard] useUser() state:', { user, isAdmin, loading })

    return () => {
      const unmountTime = performance.now()
      console.debug(`[Dashboard] Unmounted after ${Math.round(unmountTime - mountTime)}ms`)
    }
  }, [user, isAdmin, loading])

  if (loading) {
    console.debug('[Dashboard] Status: loading')
    return (
      <PageLayout title="Dashboard">
        <p className="text-muted-foreground">Loading your dashboard…</p>
      </PageLayout>
    )
  }

  if (!user) {
    console.warn('[Dashboard] No user found. Redirect or gate access.')
    return (
      <PageLayout title="Unauthorized">
        <p className="text-red-600 dark:text-red-400">Please sign in to access your dashboard.</p>
      </PageLayout>
    )
  }

  if (!user.username) {
    console.warn('[Dashboard] User object is missing `username` field:', user)
  } else {
    console.info('[Dashboard] User authenticated:', user.username)
  }

  if (isAdmin) {
    console.info('[Dashboard] User has admin role')
  }

  const handleCardClick = (to: string): void => {
    console.debug(`[DashboardCard] Navigating to ${to}`)
  }

  return (
    <PageLayout title={`Welcome, ${user.username ?? 'User'} 👋`}>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <UserDashboardCard />

        <DashboardCard
          title="Your Uploads"
          description="View and manage your 3D model uploads."
          icon={<Upload />}
          to="/upload"
          onNavigate={handleCardClick}
        />

        <DashboardCard
          title="Favorites"
          description="See models you've bookmarked."
          icon={<Star />}
          to="/favorites"
          onNavigate={handleCardClick}
        />

        {isAdmin && (
          <DashboardCard
            title="Admin Panel"
            description="Manage users, models, and pricing."
            icon={<Shield />}
            to="/admin"
            className="text-red-500"
            onNavigate={handleCardClick}
          />
        )}
      </div>
    </PageLayout>
  )
}

export default Dashboard
