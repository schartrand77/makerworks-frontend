import { useEffect } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import DashboardCard from '@/components/ui/DashboardCard'
import { useUser } from '@/hooks/useUser'
import { Users, Boxes, DollarSign, Settings } from 'lucide-react'

const Admin: React.FC = () => {
  const { user, isAdmin, loading } = useUser()

  useEffect(() => {
    console.debug('[Admin] useUser state:', { user, isAdmin, loading })
  }, [user, isAdmin, loading])

  if (loading) {
    console.debug('[Admin] Loading state active')
    return (
      <PageLayout title="Admin Panel">
        <p className="text-muted-foreground">Loading admin tools…</p>
      </PageLayout>
    )
  }

  if (!user || !isAdmin) {
    console.warn('[Admin] Unauthorized access attempt by:', user?.username || 'unknown')
    return (
      <PageLayout title="Access Denied">
        <p className="text-red-600 dark:text-red-400">Admin access required.</p>
      </PageLayout>
    )
  }

  console.info('[Admin] Admin dashboard rendering for:', user.username)

  return (
    <PageLayout title="Admin Dashboard">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <DashboardCard
          title="User Management"
          description="View, promote, demote, or delete registered users."
          icon={<Users />}
          to="/admin/users"
        />
        <DashboardCard
          title="Model Library"
          description="Audit, remove duplicates, or manage uploads."
          icon={<Boxes />}
          to="/admin/models"
        />
        <DashboardCard
          title="Pricing & Filaments"
          description="Adjust pricing formulas and filament costs."
          icon={<DollarSign />}
          to="/admin/filaments"
        />
        <DashboardCard
          title="System Settings"
          description="Inspect system status, Redis, PostgreSQL, GPU."
          icon={<Settings />}
          to="/admin/system"
        />
      </div>
    </PageLayout>
  )
}

export default Admin
