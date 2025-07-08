import { useState, useEffect, FormEvent } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import GlassCard from '@/components/ui/GlassCard'
import ModelViewer from '@/components/ui/ModelViewer'
import GlassNavbar from '@/components/ui/GlassNavbar'
import { fetchAvailableFilaments } from '@/api/filaments'
import { getEstimate } from '@/api/estimate'
import { toast } from 'sonner'

interface EstimateResult {
  estimated_time_minutes: number
  estimated_cost_usd: number
}

interface Filament {
  id: string
  type: string
  color: string
  hex: string
}

export default function Estimate() {
  const [form, setForm] = useState({
    x_mm: 50,
    y_mm: 50,
    z_mm: 50,
    filament_type: '',
    colors: [] as string[],
    custom_text: '',
    print_profile: 'standard',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EstimateResult | null>(null)
  const [filaments, setFilaments] = useState<Filament[]>([])
  const [modelUrl] = useState('/example.stl') // replace with selected model URL

  useEffect(() => {
    fetchAvailableFilaments()
      .then(setFilaments)
      .catch(err => {
        console.error('[Estimate] Failed to load filaments', err)
        toast.error('Failed to load filaments')
      })
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...form,
      x_mm: Math.max(50, Math.min(256, form.x_mm)),
      y_mm: Math.max(50, Math.min(256, form.y_mm)),
      z_mm: Math.max(50, Math.min(256, form.z_mm)),
    }

    try {
      const data = await getEstimate(payload)
      setResult(data)
      toast.success('Estimate calculated')
    } catch (err) {
      console.error('[Estimate] Estimate API failed:', err)
      toast.error('Failed to calculate estimate')
    } finally {
      setLoading(false)
    }
  }

  const toggleColor = (hex: string) => {
    setForm(prev => {
      const colors = prev.colors.includes(hex)
        ? prev.colors.filter(c => c !== hex)
        : prev.colors.length < 4
          ? [...prev.colors, hex]
          : prev.colors
      return { ...prev, colors }
    })
  }

  return (
    <>
      <GlassNavbar floating={false} />
      <PageLayout>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Model Viewer */}
          <GlassCard>
            <h2 className="text-lg font-semibold mb-2">Selected Model</h2>
            <ModelViewer src={modelUrl} />
          </GlassCard>

          {/* Form */}
          <GlassCard>
            <h2 className="text-lg font-semibold mb-2">Print Configuration</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {(['x_mm', 'y_mm', 'z_mm'] as const).map(dim => (
                <div key={dim}>
                  <label htmlFor={dim} className="block text-sm font-medium mb-1">
                    {dim.toUpperCase()} (mm) <span className="text-xs">(50–256)</span>
                  </label>
                  <input
                    id={dim}
                    type="number"
                    min={50}
                    max={256}
                    required
                    value={form[dim]}
                    onChange={(e) => setForm(f => ({ ...f, [dim]: +e.target.value }))}
                    className="w-full rounded-md border p-2 dark:bg-zinc-800"
                  />
                </div>
              ))}

              <div>
                <label htmlFor="filament" className="block text-sm font-medium mb-1">
                  Filament Type
                </label>
                <select
                  id="filament"
                  value={form.filament_type}
                  onChange={(e) => setForm(f => ({ ...f, filament_type: e.target.value }))}
                  className="w-full rounded-md border p-2 dark:bg-zinc-800"
                >
                  <option value="">Select filament</option>
                  {filaments.map(f => (
                    <option key={f.id} value={f.type}>{f.type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Select up to 4 Colors</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {filaments.map(f => (
                    <button
                      key={f.hex}
                      type="button"
                      onClick={() => toggleColor(f.hex)}
                      style={{ backgroundColor: f.hex }}
                      aria-label={`Select color ${f.color}`}
                      className={`w-6 h-6 rounded-full border-2 transition ${
                        form.colors.includes(f.hex)
                          ? 'border-black dark:border-white ring-2 ring-offset-1 ring-zinc-500'
                          : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="customText" className="block text-sm font-medium mb-1">
                  Custom Text
                </label>
                <input
                  id="customText"
                  type="text"
                  value={form.custom_text}
                  onChange={(e) => setForm(f => ({ ...f, custom_text: e.target.value }))}
                  className="w-full rounded-md border p-2 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label htmlFor="profile" className="block text-sm font-medium mb-1">
                  Print Profile
                </label>
                <select
                  id="profile"
                  value={form.print_profile}
                  onChange={(e) => setForm(f => ({ ...f, print_profile: e.target.value }))}
                  className="w-full rounded-md border p-2 dark:bg-zinc-800"
                >
                  <option value="standard">Standard</option>
                  <option value="quality">Quality</option>
                  <option value="elite">Elite</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-900 text-white py-2 rounded-md hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-busy={loading}
              >
                {loading ? 'Calculating…' : 'Calculate Estimate'}
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Result */}
        {result && (
          <GlassCard className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Estimate Result</h2>
            <div className="text-sm text-zinc-800 dark:text-zinc-200 space-y-1">
              <div>
                <strong>Estimated Time:</strong> {Math.round(result.estimated_time_minutes)} min
              </div>
              <div>
                <strong>Estimated Cost:</strong> ${result.estimated_cost_usd.toFixed(2)}
              </div>
            </div>
          </GlassCard>
        )}
      </PageLayout>
    </>
  )
}