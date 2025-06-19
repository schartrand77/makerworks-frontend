// src/components/dashboard/EstimateHistory.jsx
import Button from '@/components/ui/Button'
import { Repeat } from 'lucide-react'

export default function EstimateHistory({ userId }) {
  const estimates = [] // TODO: fetch

  return (
    <div>
      <h2 className="text-xl font-semibold">Estimate History</h2>
      {estimates.length === 0 ? (
        <p className="text-gray-400 italic mt-2">No estimates yet.</p>
      ) : (
        <div className="mt-2 space-y-4">
          {estimates.map(est => (
            <div key={est.id} className="p-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md shadow-inner">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{est.modelName}</p>
                  <p className="text-xs text-gray-400">{est.profile} • {est.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{est.price}</p>
                  <Button size="sm" icon={<Repeat size={14} />}>Reorder</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
