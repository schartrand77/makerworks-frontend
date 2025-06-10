import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import Toggle from '../components/Toggle'

export default function Favorites() {
  const { token } = useAuthStore()
  const [favorites, setFavorites] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) return
    axios
      .get('/api/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setFavorites(res.data))
      .catch(err => {
        console.error(err)
        toast.error('Failed to fetch favorites')
      })
  }, [token])

  const handleUnfavorite = async (modelId) => {
    try {
      await axios.delete(`/api/favorites/${modelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFavorites(prev => prev.filter(m => m.id !== modelId))
      toast.success('Removed from favorites')
    } catch (err) {
      console.error(err)
      toast.error('Could not remove favorite')
    }
  }

  const handleSubmitToEstimate = (model) => {
    navigate('/estimate', { state: { model } })
  }

  return (
    <div className="pt-24 px-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Your Favorites</h1>

      {favorites.length === 0 ? (
        <p className="text-white/70">No favorites saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((model) => (
            <div key={model.id} className="glass-card p-4 rounded-xl shadow-md relative">
              <img
                src={model.thumbnail_url}
                alt={model.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h2 className="text-lg font-semibold text-white">{model.name}</h2>
              <p className="text-sm text-white/60">
                Uploaded by: {model.uploaded_by}
              </p>
              <p className="text-xs text-white/40 mb-3">
                {new Date(model.created_at).toLocaleString()}
              </p>
              <div className="flex justify-between items-center mt-2">
                <Toggle
                  isOn={true}
                  onToggle={() => handleUnfavorite(model.id)}
                  label="Favorite"
                />
                <button
                  onClick={() => handleSubmitToEstimate(model)}
                  className="text-white/80 hover:text-white text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition"
                >
                  Submit to Estimate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}