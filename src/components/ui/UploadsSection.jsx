import { useEffect, useState } from 'react'
import axios from '../../api/axios'
import toast from 'react-hot-toast'
import GlassCard from '../ui/GlassCard'
import GlassGrid from '../ui/GlassGrid'
import ModelCard from '@/components/shared/ModelCard'
import { motion } from 'framer-motion'

export default function UploadsSection({ user }) {
  const [myModels, setMyModels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyModels = async () => {
      try {
        const res = await axios.get('/v1/models', { params: { mine: true } })
        setMyModels(res.data)
      } catch {
        toast.error('Failed to load your models.')
      } finally {
        setLoading(false)
      }
    }

    fetchMyModels()
  }, [user])

  return (
    <GlassCard size="expanded" elevation="glass">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        {user.username}&apos;s Uploads
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading your uploads...</p>
      ) : myModels.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven&apos;t uploaded any models yet.
        </p>
      ) : (
        <GlassGrid>
          {myModels.map((model, i) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <ModelCard model={model} />
            </motion.div>
          ))}
        </GlassGrid>
      )}
    </GlassCard>
  )
}