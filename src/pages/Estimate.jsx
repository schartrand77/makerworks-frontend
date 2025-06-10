import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useEstimateStore } from '../store/useEstimateStore'
import GlassCard from '../components/GlassCard'
import GlassButton from '../components/GlassButton'

export default function Estimate() {
  const { model } = useEstimateStore()
  const [x, setX] = useState(100)
  const [y, setY] = useState(100)
  const [z, setZ] = useState(100)
  const [material, setMaterial] = useState('PLA')
  const [colors, setColors] = useState([])
  const [profile, setProfile] = useState('Standard')
  const [customText, setCustomText] = useState('')
  const [settings, setSettings] = useState({
    custom_text_base_cost: 2.0,
    custom_text_cost_per_char: 0.1
  })
  const [estimate, setEstimate] = useState({ time: 0, cost: 0 })

  // Fetch pricing settings
  useEffect(() => {
    axios.get('/api/estimate/settings')
      .then(res => setSettings(res.data))
      .catch(() => {
        toast.error("Couldn't fetch estimate settings")
      })
  }, [])

  // Estimate calculation logic
  useEffect(() => {
    if (!model) return

    const volume = x * y * z
    const baseRate = { PLA: 0.05, 'PLA MATTE': 0.06, PETG: 0.07 }[material]
    const profileFactor = { Standard: 1.0, Quality: 1.5, Elite: 2.0 }[profile]

    const time = (volume / 5000) * profileFactor
    const baseCost = volume * baseRate + colors.length * 0.25

    const customTextCost = customText
      ? settings.custom_text_base_cost + customText.length * settings.custom_text_cost_per_char
      : 0

    const totalCost = baseCost + customTextCost

    setEstimate({
      time: time.toFixed(2),
      cost: totalCost.toFixed(2)
    })
  }, [x, y, z, material, colors, profile, model, customText, settings])

  if (!model) return <p className="text-white text-center mt-8">No model selected.</p>

  return (
    <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Preview Card */}
      <div className="lg:col-span-1">
        <GlassCard className="space-y-4 h-full">
          <h2 className="text-xl font-bold">Preview: {model.name}</h2>
          <img src={model.preview_image} alt={model.name} className="w-full rounded shadow" />
          <p className="text-sm text-gray-400">Uploaded by {model.uploader}</p>
          <p className="text-sm text-gray-400">File: {model.filename}</p>
          <p className="text-sm text-gray-400">Size: {model.size} KB</p>
        </GlassCard>
      </div>

      {/* Right Panels */}
      <div className="lg:col-span-2 space-y-6">

        {/* Dimensions */}
        <GlassCard className="space-y-2">
          <h3 className="font-semibold">Dimensions (mm)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input type="number" min={50} max={256} value={x} onChange={(e) => setX(Number(e.target.value))} className="w-full p-2 rounded" placeholder="X" />
            <input type="number" min={50} max={256} value={y} onChange={(e) => setY(Number(e.target.value))} className="w-full p-2 rounded" placeholder="Y" />
            <input type="number" min={50} max={256} value={z} onChange={(e) => setZ(Number(e.target.value))} className="w-full p-2 rounded" placeholder="Z" />
          </div>
        </GlassCard>

        {/* Material & Profile */}
        <GlassCard className="space-y-2">
          <h3 className="font-semibold">Material & Print Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full p-2 rounded">
              <option value="PLA">PLA</option>
              <option value="PLA MATTE">PLA MATTE</option>
              <option value="PETG">PETG</option>
            </select>
            <select value={profile} onChange={(e) => setProfile(e.target.value)} className="w-full p-2 rounded">
              <option value="Standard">Standard</option>
              <option value="Quality">Quality</option>
              <option value="Elite">Elite</option>
            </select>
          </div>
        </GlassCard>

        {/* Colors */}
        <GlassCard className="space-y-2">
          <h3 className="font-semibold">Colors (max 4)</h3>
          <input
            type="text"
            placeholder="Comma-separated hex codes or names"
            value={colors.join(', ')}
            onChange={(e) =>
              setColors(
                e.target.value
                  .split(',')
                  .map((c) => c.trim())
                  .slice(0, 4)
              )
            }
            className="w-full p-2 rounded"
          />
        </GlassCard>

        {/* Custom Text */}
        <GlassCard className="space-y-2">
          <h3 className="font-semibold">Custom Text (adds cost)</h3>
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="e.g. Label text"
            className="w-full p-2 rounded"
          />
          {customText && (
            <p className="text-sm text-white/60">
              + ${settings.custom_text_base_cost.toFixed(2)} base, ${settings.custom_text_cost_per_char.toFixed(2)}/char × {customText.length}
            </p>
          )}
        </GlassCard>

        {/* Estimate Summary */}
        <GlassCard className="space-y-2 text-white">
          <h3 className="font-semibold">Estimate Summary</h3>
          <p><strong>Estimated Time:</strong> {estimate.time} hrs</p>
          <p><strong>Estimated Cost:</strong> ${estimate.cost}</p>
          <GlassButton className="mt-4">Finalize Job</GlassButton>
        </GlassCard>

      </div>
    </div>
  )
}