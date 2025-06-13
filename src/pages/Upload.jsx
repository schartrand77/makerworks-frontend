import { useState } from 'react'
import axios from '../api/axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import ModelViewer from '../components/Preview/ModelViewer'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [meta, setMeta] = useState({ title: '', description: '' })
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedModel, setUploadedModel] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files) setFile(files[0])
    else setMeta((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !meta.title.trim()) {
      toast.error('STL/3MF file and title are required')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', meta.title)
    formData.append('description', meta.description)

    try {
      setUploading(true)
      setUploadProgress(0)

      const res = await axios.post('/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setUploadProgress(percent)
        },
      })

      setUploadedModel(res.data)
      toast.success('Upload complete!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white/80 to-slate-100 dark:from-black/80 dark:to-black/95 px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">Upload Model</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <input
            type="text"
            name="title"
            value={meta.title}
            onChange={handleChange}
            placeholder="Model Title"
            className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-300"
            required
          />
          <textarea
            name="description"
            value={meta.description}
            onChange={handleChange}
            placeholder="Description (optional)"
            rows={3}
            className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-300"
          />
          <input
            type="file"
            accept=".stl,.3mf"
            onChange={handleChange}
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white"
            required
          />
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
          >
            {uploading ? `Uploading... ${uploadProgress}%` : 'Upload Model'}
          </button>

          {uploading && (
            <div className="relative h-3 bg-white/20 rounded overflow-hidden mt-2">
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </form>

        {uploadedModel && (
          <div className="mt-8">
            <h3 className="text-xl text-white font-semibold mb-2">Preview:</h3>
            <ModelViewer url={uploadedModel.stl_url} />
          </div>
        )}
      </div>
    </div>
  )
}