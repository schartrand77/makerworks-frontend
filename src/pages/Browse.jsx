import { useEffect, useState } from 'react'
import { useModelStore } from '@/store/useModelStore'
import ModelCard from '@/components/shared/ModelCard'
import ModelSkeleton from '@/components/shared/ModelSkeleton'

const generateDummyModels = (count = 12) =>
  Array.from({ length: count }).map((_, i) => ({
    id: `dummy-${i}`,
    name: `Sample Model ${i + 1}`,
    uploader: { username: 'Guest' },
    thumbnail_url: '/placeholders/placeholder-stl.png',
    created_at: new Date().toISOString(),
    isDummy: true,
  }))

export default function Browse() {
  const { models, fetchAllModels } = useModelStore()
  const [loading, setLoading] = useState(true)
  const [skeletonCount, setSkeletonCount] = useState(6)

  useEffect(() => {
    const updateSkeletonCount = () => {
      const width = window.innerWidth
      const count = width > 1280 ? 12 : width > 1024 ? 9 : width > 640 ? 6 : 3
      setSkeletonCount(count)
    }

    updateSkeletonCount()
    window.addEventListener('resize', updateSkeletonCount)
    return () => window.removeEventListener('resize', updateSkeletonCount)
  }, [])

  useEffect(() => {
    const load = async () => {
      await fetchAllModels()
      setLoading(false)
    }
    load()
  }, [fetchAllModels])

  const displayModels =
    !loading && models.length === 0 ? generateDummyModels(12) : models

  return (
    <div className="px-4 pt-[100px] mx-auto w-full max-w-screen-2xl">
      {loading ? (
        <div className="grid [grid-template-columns:repeat(auto-fill,_minmax(280px,_1fr))] gap-6 gap-y-8">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i} className="w-full max-w-full overflow-hidden">
              <ModelSkeleton isDummy />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid [grid-template-columns:repeat(auto-fill,_minmax(280px,_1fr))] gap-6 gap-y-8">
          {displayModels.map((model) => (
            <div key={model.id} className="w-full max-w-full overflow-hidden">
              <ModelCard model={model} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}