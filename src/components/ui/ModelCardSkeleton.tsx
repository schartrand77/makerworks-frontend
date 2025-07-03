import GlassCard from './GlassCard'

export default function ModelCardSkeleton() {
  return (
    <GlassCard className="animate-pulse" padding="p-4">
      <div className="w-full h-40 bg-zinc-300/50 dark:bg-zinc-700/50 rounded mb-4"></div>
      <div className="h-4 bg-zinc-300/50 dark:bg-zinc-700/50 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-zinc-300/50 dark:bg-zinc-700/50 rounded w-1/2"></div>
    </GlassCard>
  )
}
