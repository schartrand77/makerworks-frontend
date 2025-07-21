import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import GlassCard from '@/components/ui/GlassCard';
import ModelViewer from '@/components/ui/ModelViewer';
import PageHeader from '@/components/ui/PageHeader';
import { fetchAvailableFilaments } from '@/api/filaments';
import { getEstimate } from '@/api/estimate';
import { Printer } from 'lucide-react';
import { toast } from 'sonner';

interface EstimateResult {
  estimated_time_minutes: number;
  estimated_cost_usd: number;
}

interface Filament {
  id: string;
  type: string;
  color: string;
  hex: string;
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
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [modelUrl] = useState('/example.stl'); // replace with selected model URL

  useEffect(() => {
    fetchAvailableFilaments()
      .then((data) => {
        setFilaments(data);
        toast.success('🎨 Filaments loaded successfully');
      })
      .catch((err) => {
        console.error('[Estimate] Failed to load filaments', err);
        toast.error('⚠️ Failed to load filaments');
      });
  }, []);

  useEffect(() => {
    if (!form.filament_type || form.colors.length === 0) {
      setResult(null);
      return;
    }

    const controller = new AbortController();
    const calculate = async () => {
      setLoading(true);

      const payload = {
        ...form,
        x_mm: Math.max(50, Math.min(256, form.x_mm)),
        y_mm: Math.max(50, Math.min(256, form.y_mm)),
        z_mm: Math.max(50, Math.min(256, form.z_mm)),
      };

      try {
        const data = await getEstimate(payload);
        setResult(data);
      } catch (err) {
        console.error('[Estimate] Estimate API failed:', err);
        toast.error('❌ Failed to calculate estimate');
        setResult(null);
      } finally {
        setLoading(false);
      }
    };

    calculate();

    return () => controller.abort();
  }, [form]);

  const toggleColor = (hex: string) => {
    setForm((prev) => {
      const colors = prev.colors.includes(hex)
        ? prev.colors.filter((c) => c !== hex)
        : prev.colors.length < 4
        ? [...prev.colors, hex]
        : prev.colors;

      if (colors.length === 4 && !prev.colors.includes(hex)) {
        toast.info('Maximum of 4 colors selected');
      }

      return { ...prev, colors };
    });
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <PageHeader icon={<Printer className="w-8 h-8 text-zinc-400" />} title="Estimate Print Job" />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Model Viewer */}
          <GlassCard>
            <h2 className="text-lg font-semibold mb-2">Selected Model</h2>
            <ModelViewer src={modelUrl} />
          </GlassCard>

          {/* Form */}
          <GlassCard>
            <h2 className="text-lg font-semibold mb-2">Print Configuration</h2>
            <div className="space-y-4">
              {/* Dimensions */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Dimensions (mm) <span className="text-xs">(50–256)</span>
                </label>
                <div className="flex gap-2">
                  {(['x_mm', 'y_mm', 'z_mm'] as const).map((dim) => (
                    <input
                      key={dim}
                      id={dim}
                      type="number"
                      min={50}
                      max={256}
                      required
                      value={form[dim]}
                      onChange={(e) => setForm((f) => ({ ...f, [dim]: +e.target.value }))}
                      placeholder={dim.toUpperCase()}
                      className="w-full rounded-md border p-2 dark:bg-zinc-800 text-center"
                    />
                  ))}
                </div>
              </div>

              {/* Filament */}
              <div>
                <label htmlFor="filament" className="block text-sm font-medium mb-1">
                  Filament Type
                </label>
                <select
                  id="filament"
                  value={form.filament_type}
                  onChange={(e) => setForm((f) => ({ ...f, filament_type: e.target.value }))}
                  className="w-full rounded-md border p-2 dark:bg-zinc-800"
                >
                  <option value="">Select filament</option>
                  {filaments.map((f) => (
                    <option key={f.id} value={f.type}>
                      {f.type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium mb-1">Select up to 4 Colors</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {filaments.map((f) => (
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

              {/* Custom Text */}
              <div>
                <label htmlFor="customText" className="block text-sm font-medium mb-1">
                  Custom Text
                </label>
                <input
                  id="customText"
                  type="text"
                  value={form.custom_text}
                  onChange={(e) => setForm((f) => ({ ...f, custom_text: e.target.value }))}
                  className="w-full rounded-md border p-2 dark:bg-zinc-800"
                />
              </div>

              {/* Print Profile */}
              <div>
                <label htmlFor="profile" className="block text-sm font-medium mb-1">
                  Print Profile
                </label>
                <select
                  id="profile"
                  value={form.print_profile}
                  onChange={(e) => setForm((f) => ({ ...f, print_profile: e.target.value }))}
                  className="w-full rounded-md border p-2 dark:bg-zinc-800"
                >
                  <option value="standard">Standard</option>
                  <option value="quality">Quality</option>
                  <option value="elite">Elite</option>
                </select>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Result */}
        <GlassCard className="mt-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Live Estimate</h2>
          {loading && (
            <div className="text-blue-600 animate-pulse py-2">
              🔄 Calculating…
            </div>
          )}

          {!loading && result && (
            <div className="flex flex-col sm:flex-row justify-center gap-6 text-base text-zinc-800 dark:text-zinc-200 mt-2">
              <div className="bg-white/20 dark:bg-zinc-700/30 p-4 rounded-lg shadow backdrop-blur">
                <strong>Estimated Time</strong>
                <div>{Math.round(result.estimated_time_minutes)} minutes</div>
              </div>
              <div className="bg-white/20 dark:bg-zinc-700/30 p-4 rounded-lg shadow backdrop-blur">
                <strong>Estimated Cost</strong>
                <div>${result.estimated_cost_usd.toFixed(2)}</div>
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="text-sm text-zinc-500 mt-2">
              Select filament & at least one color to calculate.
            </div>
          )}
        </GlassCard>
      </div>
    </PageLayout>
  );
}
