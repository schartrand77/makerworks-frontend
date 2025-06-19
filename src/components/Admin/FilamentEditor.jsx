import { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function FilamentEditor() {
  const [filaments, setFilaments] = useState([])
  const [form, setForm] = useState({
    name: '',
    color: '#ffffff',
    price_per_kg: ''
  })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchFilaments()
  }, [])

  const fetchFilaments = async () => {
    try {
      const res = await api.get('/filaments')
      setFilaments(res.data)
    } catch (err) {
      toast.error('Failed to load filaments')
    }
  }

  const resetForm = () => {
    setForm({ name: '', color: '#ffffff', price_per_kg: '' })
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.patch(`/filaments/${editingId}`, form)
        toast.success('Filament updated')
      } else {
        await api.post('/filaments', form)
        toast.success('Filament added')
      }
      resetForm()
      fetchFilaments()
    } catch (err) {
      toast.error('Save failed')
    }
  }

  const handleEdit = (f) => {
    setForm({
      name: f.name,
      color: f.color,
      price_per_kg: f.price_per_kg
    })
    setEditingId(f.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this filament?')) return
    try {
      await api.delete(`/filaments/${id}`)
      toast.success('Filament deleted')
      fetchFilaments()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="space-y-10 py-6 px-4 max-w-5xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl"
      >
        <h3 className="text-xl font-bold mb-6 text-white">
          {editingId ? 'Edit' : 'Add'} Filament
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Filament Type (e.g. PLA MATTE)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="px-3 py-2 rounded bg-white/20 text-white placeholder-gray-400"
          />
          <input
            type="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="w-full h-10 rounded bg-white/10 border border-white/20"
          />
          <input
            type="number"
            placeholder="Price per kg"
            value={form.price_per_kg}
            onChange={(e) => setForm({ ...form, price_per_kg: e.target.value })}
            step="0.01"
            min="0.01"
            required
            className="px-3 py-2 rounded bg-white/20 text-white placeholder-gray-400"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
          >
            {editingId ? 'Update Filament' : 'Add Filament'}
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              type="button"
              className="text-sm text-gray-300 hover:text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filaments.map((f) => (
          <div
            key={f.id}
            className="bg-white/10 p-5 rounded-xl border border-white/10 backdrop-blur-md shadow-lg flex justify-between items-center"
          >
            <div>
              <h4 className="text-lg font-bold text-white">{f.name}</h4>
              <p className="text-sm text-gray-300">${f.price_per_kg} per kg</p>
              <div
                className="w-6 h-6 rounded-full mt-2 border border-white"
                style={{ backgroundColor: f.color }}
              ></div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(f)}
                className="text-sm text-blue-400 hover:text-blue-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(f.id)}
                className="text-sm text-red-400 hover:text-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}