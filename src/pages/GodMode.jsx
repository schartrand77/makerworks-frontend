import { useEffect, useState } from 'react'
import GlassCard from '../components/GlassCard'
import GlassButton from '../components/GlassButton'
import GlassToggle from '../components/GlassToggle'
import BackendStatusToggle from '../components/BackendStatusToggle'

export default function GodMode() {
  const token = localStorage.getItem('token')

  // -- Filaments --
  const [filaments, setFilaments] = useState([])
  const [newEntry, setNewEntry] = useState({
    name: '',
    group: '',
    price_per_kg: '',
    color_hex: '#cccccc'
  })

  useEffect(() => {
    fetch('/api/filaments', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setFilaments)
      .catch(console.error)
  }, [])

  const updateField = (id, field, value) => {
    setFilaments((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    )
  }

  const saveFilament = async (f) => {
    const res = await fetch(`/api/filaments/${f.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(f),
    })
    if (!res.ok) alert('Update failed')
  }

  const deleteFilament = async (id) => {
    if (!window.confirm('Delete this filament?')) return
    await fetch(`/api/filaments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setFilaments((prev) => prev.filter((f) => f.id !== id))
  }

  const addFilament = async () => {
    const res = await fetch('/api/filaments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEntry),
    })
    const added = await res.json()
    setFilaments([...filaments, added])
    setNewEntry({ name: '', group: '', price_per_kg: '', color_hex: '#cccccc' })
  }

  // -- Estimate Settings --
  const [estimateSettings, setEstimateSettings] = useState({
    custom_text_base_cost: 2.0,
    custom_text_cost_per_char: 0.1,
  })

  useEffect(() => {
    fetch('/api/estimate/settings', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setEstimateSettings)
      .catch(console.error)
  }, [])

  const saveEstimateSettings = async () => {
    const res = await fetch('/api/estimate/settings', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(estimateSettings),
    })
    if (!res.ok) alert('Failed to update settings')
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">🛠️ God Mode</h1>
      <BackendStatusToggle />

      {/* Add Filament */}
      <GlassCard className="space-y-4">
        <h2 className="text-xl font-semibold">Add New Filament</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <input value={newEntry.name} onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })} placeholder="Name" className="p-2 rounded" />
          <input value={newEntry.group} onChange={(e) => setNewEntry({ ...newEntry, group: e.target.value })} placeholder="Group" className="p-2 rounded" />
          <input type="number" step="0.01" value={newEntry.price_per_kg} onChange={(e) => setNewEntry({ ...newEntry, price_per_kg: e.target.value })} placeholder="$/kg" className="p-2 rounded" />
          <input type="color" value={newEntry.color_hex} onChange={(e) => setNewEntry({ ...newEntry, color_hex: e.target.value })} className="w-full h-10 p-1" />
        </div>
        <GlassButton onClick={addFilament}>Add Filament</GlassButton>
      </GlassCard>

      {/* Filament List */}
      {filaments.map((f) => (
        <GlassCard key={f.id} className="space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 items-center">
            <input value={f.name} onChange={(e) => updateField(f.id, 'name', e.target.value)} className="p-2 rounded" />
            <input value={f.group} onChange={(e) => updateField(f.id, 'group', e.target.value)} className="p-2 rounded" />
            <input type="number" value={f.price_per_kg} onChange={(e) => updateField(f.id, 'price_per_kg', parseFloat(e.target.value))} className="p-2 rounded" />
            <input type="color" value={f.color_hex} onChange={(e) => updateField(f.id, 'color_hex', e.target.value)} className="w-full h-10 p-1" />
            <GlassToggle enabled={f.is_active} setEnabled={(val) => updateField(f.id, 'is_active', val)} label="Active" />
          </div>
          <div className="flex gap-4">
            <GlassButton onClick={() => saveFilament(f)}>Save</GlassButton>
            <GlassButton onClick={() => deleteFilament(f.id)} className="text-red-500">Delete</GlassButton>
          </div>
        </GlassCard>
      ))}

      {/* Estimate Settings */}
      <GlassCard className="space-y-4">
        <h2 className="text-xl font-semibold">Estimate Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-white/70">Base Cost ($)</label>
            <input
              type="number"
              step="0.01"
              value={estimateSettings.custom_text_base_cost}
              onChange={(e) =>
                setEstimateSettings({ ...estimateSettings, custom_text_base_cost: parseFloat(e.target.value) })
              }
              className="w-full p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-white/70">Cost per Character ($)</label>
            <input
              type="number"
              step="0.01"
              value={estimateSettings.custom_text_cost_per_char}
              onChange={(e) =>
                setEstimateSettings({ ...estimateSettings, custom_text_cost_per_char: parseFloat(e.target.value) })
              }
              className="w-full p-2 rounded"
            />
          </div>
        </div>
        <GlassButton onClick={saveEstimateSettings}>Save Estimate Settings</GlassButton>
      </GlassCard>
    </div>
  )
}