import { useState, useEffect, Suspense } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import axios from '../../api/axios'
import { useBrowseStore } from '../../store/browseStore'
import { useEstimateStore } from '../../store/estimateStore'
import toast from 'react-hot-toast'

function STLPreview({ blobUrl }) {
  const geometry = useLoader(STLLoader, blobUrl)
  return <mesh geometry={geometry}><meshStandardMaterial color="skyblue" /></mesh>
}

export default function ModelCard({ model, onFavoriteToggle }) {
  const { hoverPreviewEnabled } = useBrowseStore()
  const [hovered, setHovered] = useState(false)
  const [stlBlobUrl, setStlBlobUrl] = useState(null)
  const [isFavorite, setIsFavorite] = useState(model.is_favorite)

  const { estimateModels, addModelToEstimate } = useEstimateStore()
  const alreadyAdded = estimateModels.some((m) => m.id === model.id)
  const canAdd = !alreadyAdded && estimateModels.length < 5

  useEffect(() => {
    if (hovered && hoverPreviewEnabled && !stlBlobUrl) {
      axios.get(model.stl_url, { responseType: 'blob' }).then((res) => {
        const url = URL.createObjectURL(res.data)
        setStlBlobUrl(url)
      })
    }
  }, [hovered, hoverPreviewEnabled])

  const toggleFavorite = async () => {
    try {
      const next = !isFavorite
      await axios.post(`/models/${model.id}/favorite`, { favorite: next })
      setIsFavorite(next)
      if (onFavoriteToggle && !next) onFavoriteToggle()
    } catch (err) {
      toast.error('Failed to update favorite')
    }
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-xl border border-white/10 bg-white/10 backdrop-blur-md shadow-md p-4 flex flex-col transition hover:scale-[1.01]"
    >
      {/* Favorite button */}
      <button
        onClick={toggleFavorite}
        className="absolute top-2 right-2 z-10 text-xl text-yellow-400 hover:scale-110 transition"
        title={isFavorite ? 'Unfavorite' : 'Favorite'}
      >
        {isFavorite ? '⭐' : '☆'}
      </button>

      {/* Thumbnail / Preview */}
      <div className="aspect-video bg-white/5 rounded overflow-hidden">
        {hovered && hoverPreviewEnabled && stlBlobUrl ? (
          <Canvas camera={{ position: [0, 0, 50] }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
              <STLPreview blobUrl={stlBlobUrl} />
            </Suspense>
            <OrbitControls enableZoom={false} autoRotate />
          </Canvas>
        ) : (
          <img
            src={model.thumbnail_url || '/placeholder.png'}
            alt={model.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Title + description */}
      <div className="text-white mt-2 space-y-1">
        <h3 className="text-lg font-semibold truncate">{model.title}</h3>
        <p className="text-sm text-gray-300 line-clamp-2">{model.description}</p>

        {/* Estimate Button */}
        {alreadyAdded ? (
          <a
            href="/estimate"
            className="mt-2 block text-center w-full text-sm px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white transition"
          >
            View Estimate
          </a>
        ) : (
          <button
            onClick={() => addModelToEstimate(model)}
            disabled={!canAdd}
            className="mt-2 w-full text-sm px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit to Estimate
          </button>
        )}
      </div>
    </div>
  )
}