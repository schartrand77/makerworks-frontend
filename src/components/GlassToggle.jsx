export default function GlassToggle({ enabled, setEnabled, label }) {
  return (
    <label className="flex items-center justify-between w-full px-4 py-2 bg-white/10 backdrop-blur rounded-xl border border-white/20">
      <span className="text-sm text-white">{label}</span>
      <button
        type="button"
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          enabled ? 'bg-blue-500' : 'bg-gray-500/40'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  )
}