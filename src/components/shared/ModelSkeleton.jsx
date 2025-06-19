export default function ModelSkeleton({ isDummy = false }) {
  return (
    <div className="relative animate-pulse rounded-xl bg-white/5 border border-white/10 p-4 space-y-3 shadow-inner dark:bg-zinc-900 dark:border-zinc-700">
      {isDummy && (
        <div className="absolute top-2 right-2 text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 bg-blue-600 text-white rounded-full shadow">
          Demo
        </div>
      )}

      <div className="aspect-[4/5] bg-gray-300/10 dark:bg-gray-600/10 rounded-md overflow-hidden">
        <img
          src="/placeholders/placeholder-stl.png"
          alt="Placeholder Model"
          className="w-full h-full object-contain opacity-80"
        />
      </div>

      <div className="h-4 bg-gray-300/30 dark:bg-gray-500/30 rounded w-2/3" />
      <div className="h-3 bg-gray-300/20 dark:bg-gray-600/20 rounded w-1/3" />
    </div>
  )
}