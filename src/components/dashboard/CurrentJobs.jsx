// src/components/dashboard/CurrentJobs.jsx
import { Printer, Timer } from 'lucide-react'

export default function CurrentJobs({ userId }) {
  const jobs = [] // TODO: fetch

  return (
    <div>
      <h2 className="text-xl font-semibold">Active Print Jobs</h2>
      {jobs.length === 0 ? (
        <p className="text-gray-400 italic mt-2">No active jobs.</p>
      ) : (
        <ul className="space-y-4 mt-2">
          {jobs.map(job => (
            <li key={job.id} className="p-4 rounded-xl bg-white/10 hover:bg-white/20 transition backdrop-blur-md shadow-inner border border-white/10">
              <div className="flex justify-between items-center">
                <div className="font-medium">{job.modelName}</div>
                <div className="text-sm text-gray-400">{job.status}</div>
              </div>
              <div className="h-2 w-full bg-gray-700 rounded-full mt-2">
                <div className="h-2 bg-blue-400 rounded-full" style={{ width: `${job.progress}%` }} />
              </div>
              <p className="text-xs text-right text-gray-400 mt-1">
                ETA: {job.eta}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}