import { useEffect } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import GlassCard from '@/components/ui/GlassCard'

const Browse: React.FC = () => {
  useEffect(() => {
    console.debug('[Browse] Component mounted')

    // Placeholder for future model loading
    console.debug('[Browse] Using static demo cards')
  }, [])

  return (
    <PageLayout title="Browse Models">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <GlassCard>
          <h2 className="text-lg font-semibold mb-2">Articulated Dragon</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            A flexible 3D printed dragon with articulating joints.
          </p>
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-semibold mb-2">Cable Organizer</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Clip-on cable holder with customizable length.
          </p>
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-semibold mb-2">Mini Planter</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Stylish desktop planter for succulents and small herbs.
          </p>
        </GlassCard>
      </div>
    </PageLayout>
  )
}

export default Browse
