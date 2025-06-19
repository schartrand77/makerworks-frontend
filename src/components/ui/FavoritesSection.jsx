import { useEffect, useState } from 'react'
import axios from '../../api/axios'
import toast from 'react-hot-toast'
import GlassCard from '../ui/GlassCard'
import GlassGrid from '../ui/GlassGrid'
import ModelCard from '../shared/ModelCard';
import PaginationControls from '../shared/PaginationControls'
import { motion } from 'framer-motion'

export default function FavoritesSection({ user }) {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const perPage = 8

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get('/v1/models')
        const favs = res.data.filter((m) => m.is_favorite)
        setFavorites(favs)
      } catch {
        toast.error('Failed to load favorites.')
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [user])

  const paged = favorites.slice((page - 1) * perPage, page * perPage)

  const handleUnfavorite = (id) => {
    setFavorites((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <GlassCard size="expanded" elevation="glass">
      <h2 className="text-3xl font-bold mb-4 text-center text-white">Your Favorites</h2>

      {loading ? (
        <p className="text-center text-gray-400">Loading favorites...</p>
      ) : favorites.length === 0 ? (
        <p className="text-center text-gray-500">You haven&apos;t favorited any models yet.</p>
      ) : (
        <>
          <GlassGrid>
            {paged.map((model, i) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <ModelCard
                  model={model}
                  onFavoriteToggle={() => handleUnfavorite(model.id)}
                />
              </motion.div>
            ))}
          </GlassGrid>
          <PaginationControls
            total={favorites.length}
            page={page}
            setPage={setPage}
          />
        </>
      )}
    </GlassCard>
  )
}