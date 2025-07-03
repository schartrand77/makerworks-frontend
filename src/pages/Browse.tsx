import { useEffect, useState } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import GlassCard from '@/components/ui/GlassCard'
import GlassButton from '@/components/ui/GlassButton'
import ModelCardSkeleton from '@/components/ui/ModelCardSkeleton'

const Browse: React.FC = () => {
  const [query, setQuery] = useState('')

  useEffect(() => {
    console.debug('[Browse] Component mounted')
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.debug('[Browse] Search submitted:', query)
  }

  return (
    <PageLayout title="Browse Models">
      <GlassCard className="mb-6">
        <form onSubmit={handleSearch} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search MakerWorks"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="glass-input flex-grow"
            />
            <GlassButton type="submit" size="sm">
              Search
            </GlassButton>
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400 flex flex-wrap gap-4">
            <span>External Libraries:</span>
            <a
              href="https://www.thingiverse.com"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              Thingiverse
            </a>
            <a
              href="https://www.printables.com"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              Printables
            </a>
            <a
              href="https://thangs.com"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              Thangs
            </a>
            <a
              href="https://makerworld.com"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              Makerworld
            </a>
          </div>
        </form>
      </GlassCard>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ModelCardSkeleton key={i} />
        ))}
      </div>
    </PageLayout>
  )
}

export default Browse
