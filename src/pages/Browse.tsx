import { useEffect, useState } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import GlassCard from '@/components/ui/GlassCard'
import GlassNavbar from '@/components/ui/GlassNavbar'
import axios from '@/api/axios'

interface Model {
  id: string
  name: string
  description: string
  thumbnail_url?: string
}

const Browse: React.FC = () => {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.debug('[Browse] Component mounted')

    const fetchModels = async () => {
      try {
        console.debug('[Browse] Fetching models from backend…')
        const res = await axios.get<Model[]>('/api/models')
        setModels(res.data)
        console.debug('[Browse] Models loaded:', res.data)
      } catch (err) {
        console.error('[Browse] Failed to fetch models:', err)
        setError('⚠️ Failed to load models. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [])

  return (
    <>
      <GlassNavbar floating={false} />
      <PageLayout title="Browse Models">
        {loading && (
          <div className="text-center text-zinc-500 dark:text-zinc-400 py-8">
            Loading models…
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 py-8">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {models.length === 0 && (
              <div className="text-center col-span-full text-zinc-500 dark:text-zinc-400 py-8">
                No models found.
              </div>
            )}

            {models.map(model => (
              <GlassCard key={model.id}>
                {model.thumbnail_url ? (
                  <img
                    src={model.thumbnail_url}
                    alt={model.name}
                    className="rounded-md mb-2 w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center rounded-md mb-2 text-sm text-zinc-400">
                    No Thumbnail
                  </div>
                )}
                <h2 className="text-lg font-semibold mb-1">{model.name}</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {model.description}
                </p>
              </GlassCard>
            ))}
          </div>
        )}
      </PageLayout>
    </>
  )
}

export default Browse