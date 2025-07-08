import { useEffect } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import DashboardCard from '@/components/ui/DashboardCard'
import UserDashboardCard from '@/components/ui/UserDashboardCard'
import GlassNavbar from '@/components/ui/GlassNavbar'
import { useUser } from '@/hooks/useUser'
import { Star, Upload, Shield } from 'lucide-react'

const Dashboard: React.FC = () => {
  const { user, isAdmin, loading } = useUser()

  useEffect(() => {
    console.debug('[Dashboard] useUser() state:', { user, isAdmin, loading })
  }, [user, isAdmin, loading])

  if (loading) {
    return (
      <>
        <GlassNavbar floating={false} />
        <PageLayout>
          <div className="text-center text-zinc-500 dark:text-zinc-400 py-8">
            Loading your dashboard…
          </div>
        </PageLayout>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <GlassNavbar floating={false} />
        <PageLayout>
          <div className="text-center text-red-600 dark:text-red-400 py-8">
            🚫 Please sign in to access your dashboard.
          </div>
        </PageLayout>
      </>
    )
  }

  return (
    <>
      <GlassNavbar floating={false} />
      <PageLayout>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <UserDashboardCard />

          <DashboardCard
            title="Your Uploads"
            description="View and manage your 3D model uploads."
            icon={<Upload />}
            to="/uploads"
          />

          <DashboardCard
            title="Favorites"
            description="See models you've bookmarked."
            icon={<Star />}
            to="/favorites"
          />

          {isAdmin && (
            <DashboardCard
              title="Admin Panel"
              description="Manage users, models, and pricing."
              icon={<Shield />}
              to="/admin"
              className="text-red-500"
            />
          )}
        </div>
      </PageLayout>
    </>
  )
}

export default Dashboard