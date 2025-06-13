import { useState } from 'react'
import axios from '../../api/axios'
import toast from 'react-hot-toast'
import ModelViewer from '../Preview/ModelViewer' // adjust path as needed

export default function UploadForm() {
  const [file, setFile] = useState(null)
  const [meta, setMeta] = useState({ title: '', description: '' })
  const [modelUrl, setModelUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file || !meta.title.trim()) {
      toast.error('Model file and title are required')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', meta.title)
    formData.append('description', meta.description)

    try {
      setLoading(true)
      const res = await axios.post('/upload', formData)
      setModelUrl(res.data.url)
      toast.success('Upload successful!')
    } catch (err) {
      console.error(err)
      toast.error('Upload failed. See console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto p-4 bg-white/10 backdrop-blur-md rounded-xl shadow-xl">
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Model Title"
          value={meta.title}
          onChange={(e) => setMeta({ ...meta, title: e.target.value })}
          className="w-full px-4 py-2 rounded bg-white/20 placeholder-gray-400"
        />
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={meta.description}
          onChange={(e) => setMeta({ ...meta, description: e.target.value })}
          className="w-full px-4 py-2 rounded bg-white/20 placeholder-gray-400"
        />
        <input
          type="file"
          accept=".stl,.3mf"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {modelUrl && (
        <div className="mt-6 border border-white/10 rounded-xl p-4 bg-white/5">
          <h2 className="text-lg mb-2">Preview</h2>
          <ModelViewer url={modelUrl} />
        </div>
      )}
    </div>
  )
}