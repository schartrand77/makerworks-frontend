export default function SkeletonDashboardCard() {
  return (
    <div className="animate-pulse rounded-3xl bg-white/10 dark:bg-black/20 backdrop-blur-md p-6 shadow-md">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-white/20" />
        <div className="space-y-2">
          <div className="w-32 h-4 bg-white/20 rounded" />
          <div className="w-20 h-3 bg-white/15 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="w-48 h-3 bg-white/15 rounded" />
        <div className="w-40 h-3 bg-white/10 rounded" />
      </div>
      <div className="flex gap-2 mt-4">
        <div className="w-20 h-8 rounded-full bg-white/10" />
        <div className="w-20 h-8 rounded-full bg-white/10" />
      </div>
    </div>
  )
}