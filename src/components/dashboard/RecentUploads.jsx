import { useEffect, useState } from 'react'
import ModelCard from '@/components/shared/ModelCard'

export default function RecentUploads({ userId }) {
  const [uploads, setUploads] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadUploads() {
      try {
        const res = await fetch(`/api/models?user_id=${userId}`)
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        const data = await res.json()
        setUploads(data)
      } catch (err) {
        console.error('Failed to fetch recent uploads:', err)
        setError(err)
      }
    }

    if (userId) loadUploads()
  }, [userId])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Uploads</h2>

      {error ? (
        <p className="text-red-400 italic">Something went wrong loading uploads.</p>
      ) : uploads.length === 0 ? (
        <p className="text-gray-400 italic">No uploads yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {uploads.map(upload => (
            <ModelCard key={upload.id} model={upload} type="dashboard" />
          ))}
        </div>
      )}
    </div>
  )
}