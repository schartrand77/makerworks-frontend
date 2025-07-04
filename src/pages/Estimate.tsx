import { useState, useEffect, FormEvent } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import GlassCard from '@/components/ui/GlassCard'
import { useEstimateStore } from '@/store/useEstimateStore'
import { getEstimate } from '@/api/estimate'
import { toast } from 'sonner'

interface EstimateForm {
  x_mm: number | string
  y_mm: number | string
  z_mm: number | string
  filament_type: 'pla' | 'petg'
  filament_color: string
  print_profile: 'standard' | 'quality' | 'elite'
}

interface EstimateResult {
  estimated_time_minutes: number
  estimated_cost_usd: number
}

export default function Estimate() {
  const { form, setForm, result, setResult } = useEstimateStore()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    console.debug('[Estimate] Mounted with form state:', form)
  }, [form])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.debug('[Estimate] Submit triggered with form:', form)

    setLoading(true)
    try {
      const payload = {
        x_mm: parseFloat(form.x_mm as string),
        y_mm: parseFloat(form.y_mm as string),
        z_mm: parseFloat(form.z_mm as string),
        filamentType: form.filament_type,
        filamentColor: form.filament_color,
        printProfile: form.print_profile,
      }

      console.debug('[Estimate] Sending payload to API:', payload)
      const data: EstimateResult = await getEstimate(payload)
      console.info('[Estimate] API response received:', data)

      setResult(data)
      toast.success('Estimate calculated')
    } catch (err) {
      console.error('[Estimate] Estimate API failed:', err)
      toast.error('Failed to calculate estimate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="Estimate Print Cost & Time">
      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard>
          <h2 className="text-lg font-semibold mb-2">Selected Model</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No model selected. (TODO: add selection from Browse page.)
          </p>
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-semibold mb-2">Print Configuration</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {(['x_mm', 'y_mm', 'z_mm'] as Array<keyof EstimateForm>).map((dim) => (
              <div key={dim}>
                <label className="block text-sm font-medium mb-1">
                  {dim.toUpperCase()} (mm)
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={form[dim]}
                  onChange={(e) => {
                    setForm(dim, e.target.value)
                    console.debug(`[Estimate] Updated ${dim}:`, e.target.value)
                  }}
                  className="w-full rounded-md border p-2 dark:bg-zinc-800"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-1">Filament Type</label>
              <select
                value={form.filament_type}
                onChange={(e) => {
                  setForm('filament_type', e.target.value)
                  console.debug('[Estimate] filament_type:', e.target.value)
                }}
                className="w-full rounded-md border p-2 dark:bg-zinc-800"
              >
                <option value="pla">PLA</option>
                <option value="petg">PETG</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Filament Color</label>
              <input
                type="color"
                value={form.filament_color}
                onChange={(e) => {
                  setForm('filament_color', e.target.value)
                  console.debug('[Estimate] filament_color:', e.target.value)
                }}
                className="w-full rounded-md border p-2 h-10 dark:bg-zinc-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Print Profile</label>
              <select
                value={form.print_profile}
                onChange={(e) => {
                  setForm('print_profile', e.target.value)
                  console.debug('[Estimate] print_profile:', e.target.value)
                }}
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
              className="w-full bg-zinc-900 text-white py-2 rounded-md hover:bg-zinc-800"
            >
              {loading ? 'Calculating…' : 'Calculate Estimate'}
            </button>
          </form>
        </GlassCard>
      </div>

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
  )
}
