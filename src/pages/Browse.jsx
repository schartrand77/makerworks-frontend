import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEstimateStore } from '../store/useEstimateStore'
import GlassCard from '../components/GlassCard'
import GlassButton from '../components/GlassButton'
import GlassToggle from '../components/GlassToggle'
import STLPreviewCanvas from '../components/STLPreviewCanvas'

export default function Browse() {
  const [models, setModels] = useState([])
  const [favorites, setFavorites] = useState(new Set())
  const [user, setUser] = useState(null)
  const [rotatePreview, setRotatePreview] = useState(false)
  const { setModel } = useEstimateStore()
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const fetchAll = async () => {
      try {
        const [modelsRes, userRes, favRes] = await Promise.all([
          fetch('/api/models'),
          fetch('/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/favorites', { headers: { Authorization: `Bearer ${token}` } }),
        ])

        const modelsData = await modelsRes.json()
        const userData = await userRes.json()
        const favData = await favRes.json()

        setModels(modelsData.models)
        setUser(userData)
        setFavorites(new Set(favData.ids))
      } catch (err) {
        console.error('Error loading models or user:', err)
      }
    }

    fetchAll()
  }, [])

  const toggleFavorite = async (modelId) => {
    const token = localStorage.getItem('token')
    if (!token) return

    const isFav = favorites.has(modelId)
    const method = isFav ? 'DELETE' : 'POST'

    await fetch(`/api/favorites/${modelId}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    })

    setFavorites((prev) => {
      const updated = new Set(prev)
      isFav ? updated.delete(modelId) : updated.add(modelId)
      return updated
    })
  }

  const handleEstimate = (model) => {
    setModel(model)
    navigate('/estimate')
  }

  const deleteModel = async (modelId) => {
    const token = localStorage.getItem('token')
    if (!token) return
    if (!window.confirm('Are you sure you want to delete this model?')) return

    const res = await fetch(`/api/models/${modelId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.ok) {
      setModels((prev) => prev.filter((m) => m.id !== modelId))
    } else {
      alert('Failed to delete model.')
    }
  }

  const canDelete = (model) =>
    user && (user.uid === model.uploader || user.role === 'admin')

  return (
    <div className="p-4 space-y-6">
      <div className="max-w-sm mx-auto">
        <GlassToggle
          enabled={rotatePreview}
          setEnabled={setRotatePreview}
          label="Rotate Preview"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <GlassCard key={model.id} className="space-y-2">
            {rotatePreview ? (
              <STLPreviewCanvas url={`/models/${model.filename}`} />
            ) : (
              <img
                src={model.preview_image}
                alt={model.name}
                className="w-full h-48 object-cover rounded"
              />
            )}

            <h3 className="text-lg font-semibold">{model.name}</h3>
            <p className="text-sm text-gray-500">
              Uploaded by <strong>{model.uploader}</strong><br />
              {new Date(model.uploaded_at).toLocaleString()}
            </p>

            <div className="flex flex-wrap justify-between items-center gap-2 mt-2">
              <GlassButton onClick={() => toggleFavorite(model.id)} className="text-sm">
                {favorites.has(model.id) ? '★ Saved' : '☆ Save'}
              </GlassButton>

              <GlassButton onClick={() => handleEstimate(model)} className="text-sm">
                Submit to Estimates
              </GlassButton>

              {canDelete(model) && (
                <GlassButton
                  onClick={() => deleteModel(model.id)}
                  className="text-sm text-red-500"
                >
                  Delete
                </GlassButton>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}