import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { motion } from 'framer-motion'

// Primary cards
import UserDashboardCard from '@/components/dashboard/UserDashboardCard'
import UploadsSection from '@/components/ui/UploadsSection'
import FavoritesSection from '@/components/ui/FavoritesSection'
import EstimateHistory from '@/components/dashboard/EstimateHistory'
import Notifications from '@/components/dashboard/Notifications'
import CartPreview from '@/components/dashboard/CartPreview'

// Shared UI
import GlassCard from '@/components/ui/GlassCard'

// Skeletons
import SkeletonDashboardCard from '@/components/dashboard/SkeletonDashboardCard'
import SkeletonFavoritesCard from '@/components/dashboard/SkeletonFavoritesCard'

export default function Dashboard() {
  const { user, loading, authLoaded, fetchUser } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchUser()
  }, [])

  if (!authLoaded || loading) {
    return (
      <div className="pt-[72px] pb-16 px-4 bg-gradient-to-b from-white/80 to-slate-100 dark:from-[#101010] dark:to-[#050505]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto w-full">
          <div className="md:col-span-4">
            <SkeletonDashboardCard />
          </div>
          <div className="md:col-span-8 space-y-6">
            <SkeletonFavoritesCard onUploadClick={() => navigate('/upload')} />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>You must be signed in to view this page.</p>
      </div>
    )
  }

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="pt-[119px] pb-16 px-4 bg-gradient-to-b from-white/80 to-slate-100 dark:from-[#101010] dark:to-[#050505] min-h-screen"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto w-full">
        <motion.div
          className="md:col-span-4"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <GlassCard size="compact" elevation="md">
            <UserDashboardCard user={user} />
          </GlassCard>
        </motion.div>

        <motion.div
          className="md:col-span-8"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <GlassCard size="expanded" elevation="xl" hoverEffect>
  <div className="relative z-10">
    <button
      onClick={() => navigate('/upload')}
      className="absolute top-3 right-3 z-20 bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-1.5 rounded-full backdrop-blur border border-white/20 shadow-md transition"
    >
      Upload
    </button>
    <div className="relative z-0">
      <UploadsSection user={user} />
    </div>
  </div>
</GlassCard>
        </motion.div>

        <motion.div
          className="md:col-span-4"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <GlassCard size="medium" elevation="glass" hoverEffect>
            <EstimateHistory userId={user.id} />
          </GlassCard>
        </motion.div>

        <motion.div
          className="md:col-span-4"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <GlassCard size="medium" elevation="glass" hoverEffect ripple>
            <FavoritesSection user={user} />
          </GlassCard>
        </motion.div>

        <motion.div
          className="md:col-span-4"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <GlassCard size="medium" elevation="md">
            <Notifications userId={user.id} />
          </GlassCard>
        </motion.div>

        <motion.div
          className="md:col-span-4"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <GlassCard size="medium" elevation="md">
            <CartPreview userId={user.id} />
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  )
}