import { useState } from 'react'
import GlassCard from '../components/GlassCard'
import GlassButton from '../components/GlassButton'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState(null)

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0]
    if (uploaded && (uploaded.name.endsWith('.stl') || uploaded.name.endsWith('.3mf'))) {
      setFile(uploaded)
      setStatus(null)
    } else {
      setFile(null)
      setStatus('Only .stl or .3mf files are allowed.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file || !name || !description) {
      setStatus('Please fill out all required fields.')
      return
    }

    const token = localStorage.getItem('token') // or your preferred storage

    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('tags', tags)
    formData.append('category', category)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) throw new Error()

      setStatus('Upload successful!')
      setFile(null)
      setName('')
      setDescription('')
      setTags('')
      setCategory('')
    } catch (err) {
      setStatus('Upload failed. Please try again.')
    }
  }

  return (
    <GlassCard className="w-full max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-center">Upload 3D Model</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept=".stl,.3mf"
          onChange={handleFileChange}
          className="w-full"
          required
        />

        <input
          type="text"
          placeholder="Model Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded"
          rows={4}
          required
        />

        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 rounded"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 rounded"
        />

        <GlassButton type="submit">Upload</GlassButton>

        {status && <p className="text-center text-sm">{status}</p>}
      </form>
    </GlassCard>
  )
}