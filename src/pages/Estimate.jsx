import { useState, useEffect } from 'react'
import { useEstimateStore } from '../store/estimateStore'
import { useCartStore } from '../store/cartStore'
import ModelViewer from '../components/ModelViewer'
import toast from 'react-hot-toast'
import api from '../api/axios'

const PRINT_SPEEDS = {
  standard: 14,
  quality: 8,
  elite: 5,
}

const defaultDims = { x: 100, y: 100, z: 100 }

export default function Estimate() {
  const {
    estimateModels,
    selectedModelId,
    selectModel,
    availableFilaments,
    setAvailableFilaments,
  } = useEstimateStore()

  const { addToCart } = useCartStore()

  const [dims, setDims] = useState(defaultDims)
  const [profile, setProfile] = useState('standard')
  const [filamentColors, setFilamentColors] = useState(['#ff0000'])
  const [customText, setCustomText] = useState('')
  const [filamentType, setFilamentType] = useState('')

  const model = estimateModels.find((m) => m.id === selectedModelId) || estimateModels[0]

  useEffect(() => {
    if (availableFilaments.length === 0) {
      axios
        .get('/filaments')
        .then((res) => {
          setAvailableFilaments(res.data)
          if (res.data.length > 0) {
            setFilamentType(res.data[0].name)
          }
        })
        .catch(() => toast.error('Failed to load filaments'))
    } else {
      setFilamentType(availableFilaments[0].name)
    }
  }, [])

  if (!model && estimateModels.length === 0) {
    return <p className="text-center mt-20 text-gray-400">No models submitted for estimation.</p>
  }

  const baseVolume = model?.volume_mm3 || 100000
  const scaleFactor = (dims.x * dims.y * dims.z) / (100 * 100 * 100)
  const volume = baseVolume * scaleFactor

  const filament = availableFilaments.find((f) => f.name === filamentType)
  const pricePerGram = filament ? filament.price_per_kg / 1000 : 0.025
  const density = filament?.density || 1.24

  const cost = (volume * density * pricePerGram).toFixed(2)
  const time = (volume / PRINT_SPEEDS[profile]).toFixed(1)

  const handleDim = (key, val) => {
    if (val >= 50 && val <= 256) {
      setDims((prev) => ({ ...prev, [key]: val }))
    } else {
      toast.error(`${key.toUpperCase()} must be 50–256mm`)
    }
  }

  const handleAddToCart = () => {
    const payload = {
      model_id: model.id,
      title: model.title,
      thumbnail_url: model.thumbnail_url,
      dims,
      volume,
      profile,
      customText,
      filamentType,
      colors: filamentColors,
      estimated_cost: Number(cost),
      estimated_time: Number(time),
    }
    addToCart(payload)
    toast.success('Added to cart!')
  }

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-b from-white/80 to-slate-100 dark:from-[#101010] dark:to-[#050505]">
      <h1 className="text-4xl font-bold text-center mb-6 text-white">Estimate</h1>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {estimateModels.map((m) => (
          <button
            key={m.id}
            onClick={() => selectModel(m.id)}
            className={`px-4 py-2 rounded-xl border ${
              m.id === model.id
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {m.title}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-md shadow-xl">
        <div>
          <ModelViewer url={model.stl_url} />
        </div>

        <div className="space-y-4 text-white">
          <div className="grid grid-cols-3 gap-4">
            {['x', 'y', 'z'].map((axis) => (
              <div key={axis}>
                <label className="block text-sm font-medium">{axis.toUpperCase()} (mm)</label>
                <input
                  type="number"
                  value={dims[axis]}
                  onChange={(e) => handleDim(axis, Number(e.target.value))}
                  min={50}
                  max={256}
                  className="w-full px-3 py-1 bg-white/10 border border-white/20 rounded"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Filament Type</label>
            <select
              value={filamentType}
              onChange={(e) => setFilamentType(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded"
            >
              {availableFilaments.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Filament Colors (max 4)</label>
            <div className="flex gap-2 flex-wrap">
              {filamentColors.map((color, i) => (
                <input
                  key={i}
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const updated = [...filamentColors]
                    updated[i] = e.target.value
                    setFilamentColors(updated)
                  }}
                  className="w-10 h-10 rounded-full border border-white"
                />
              ))}
              {filamentColors.length < 4 && (
                <button
                  onClick={() => setFilamentColors([...filamentColors, '#ffffff'])}
                  className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded border border-white/20"
                >
                  + Add Color
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Print Profile</label>
            <select
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded"
            >
              <option value="standard">Standard (fastest)</option>
              <option value="quality">Good Quality</option>
              <option value="elite">High Quality (slowest)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Custom Text (optional)</label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Add label, message, etc."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded"
            />
          </div>

          <div className="pt-4 text-lg border-t border-white/10 space-y-2">
            <p>Estimated Volume: <strong>{volume.toFixed(0)} mm³</strong></p>
            <p>Estimated Cost: <strong>${cost}</strong></p>
            <p>Estimated Print Time: <strong>{time} sec</strong></p>

            <button
              onClick={handleAddToCart}
              className="mt-3 px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}