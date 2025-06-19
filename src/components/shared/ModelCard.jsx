import { Printer, UserCircle, Clock } from 'lucide-react'

export default function ModelCard({ model }) {
  const {
    name,
    thumbnail_url,
    created_at,
    uploader,
    print_time,
    print_profile,
    status,
    isDummy
  } = model

  return (
    <div className="relative w-full max-w-full h-full box-border flex flex-col justify-between rounded-xl p-4 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/10 shadow-inner transition-all transform scale-y-[0.90] origin-top">
      {/* Demo badge */}
      {isDummy && (
        <div className="absolute top-2 right-2 text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 bg-blue-600 text-white rounded-full shadow">
          Demo
        </div>
      )}

      {/* Top: Model name */}
      <h3 className="text-lg font-semibold mb-3 truncate">{name}</h3>

      {/* Middle: Thumbnail */}
      <div className="aspect-[4/5] w-full overflow-hidden rounded-lg mb-3 bg-white/5 dark:bg-zinc-800">
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={`${name} preview`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            No Preview
          </div>
        )}
      </div>

      {/* Middle: Print metadata */}
      {!isDummy && (
        <div className="text-xs text-gray-400 space-y-1 mb-3">
          <div className="flex items-center gap-2">
            <Printer size={14} /> {print_profile || 'Standard'}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} /> {print_time || '—'}
          </div>
          <div className="text-amber-400 font-medium">{status}</div>
        </div>
      )}

      {/* Bottom: user + estimate button */}
      <div className="mt-auto flex items-center justify-between">
        <div className="text-sm text-gray-300 flex items-center gap-2">
          <UserCircle size={16} className="text-gray-400" />
          {uploader?.username || 'Unknown'}
        </div>
        <button className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-white backdrop-blur-md shadow-inner">
          Get Estimate
        </button>
      </div>
    </div>
  )
}