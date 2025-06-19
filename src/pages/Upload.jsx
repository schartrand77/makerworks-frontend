import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import ThreePreview from '@/components/preview/ThreePreview'
import api from '../api/axios'
import { useAuthStore } from '../store/useAuthStore'

const Upload = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [uploadId, setUploadId] = useState(null)
  const [thumbnailUrl, setThumbnailUrl] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const f = acceptedFiles[0]
      setFile(f)
      setName(f.name.replace(/\.[^/.]+$/, ''))
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'model/stl': ['.stl'] },
    multiple: false,
    onDrop,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !name) {
      setError('Model name and file are required')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('user_id', user?.id)

    try {
      setUploading(true)
      setError(null)
      setThumbnailUrl(null)

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) {
            const percent = Math.round((e.loaded * 100) / e.total)
            setProgress(percent)
          }
        },
      })

      setUploadId(res.data.upload_id || res.data.id)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.detail || 'Upload failed.')
      setUploading(false)
    }
  }

  useEffect(() => {
    if (!uploadId) return
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/upload/status/${uploadId}`)
        if (res.data.thumbnail_url) {
          setThumbnailUrl(res.data.thumbnail_url)
          setUploading(false)
          clearInterval(interval)
        }
      } catch (err) {
        console.warn('Polling failed', err)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [uploadId])

  return (
    <div className="pt-[112px] pb-24 px-4 min-h-screen bg-gradient-to-b ...">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 dark:bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl px-8 py-10 space-y-8">
          <h1 className="text-3xl font-semibold text-center text-white">Upload 3D Model</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Drag and Drop */}
            <div
              {...getRootProps()}
              className={`w-full p-6 rounded-xl border-2 border-dashed transition text-white cursor-pointer
              ${isDragActive ? 'border-blue-400 bg-white/20' : 'border-white/20 bg-white/10'}
              hover:border-blue-300 hover:bg-white/15`}
            >
              <input {...getInputProps()} />
              <p className="text-center">
                {isDragActive ? 'Drop the file here...' : 'Drag and drop your STL file, or click to select'}
              </p>
            </div>

            {/* Selected File Info + 3D Preview */}
            {file && (
              <div className="space-y-4">
                <div className="bg-white/10 border border-white/10 rounded-xl p-4 text-white text-sm shadow-inner">
                  <div className="font-semibold mb-1">Selected File:</div>
                  <div>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</div>
                </div>
                <ThreePreview file={file} />
              </div>
            )}

            {/* Form Fields */}
            <input
              type="text"
              placeholder="Model Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/30 dark:bg-white/10 text-white placeholder-gray-300"
              required
            />

            <textarea
              placeholder="Credit Model Creator:"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/30 dark:bg-white/10 text-white placeholder-gray-300"
              rows={3}
            />

            {error && <div className="text-red-400 text-sm">{error}</div>}

            {/* Upload Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold transition shadow-md relative overflow-hidden"
            >
              {uploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <span>Uploading...</span>
                  <div className="w-1/2 h-2 bg-white/20 rounded overflow-hidden">
                    <div
                      className="h-full bg-white/80 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                'Upload Model'
              )}
            </button>
          </form>

          {/* Thumbnail Preview */}
          {thumbnailUrl && (
            <div className="mt-6 text-center">
              <p className="text-white text-sm mb-2">Render Preview:</p>
              <img
                src={thumbnailUrl}
                alt="thumbnail"
                className="w-full max-w-xs mx-auto rounded-xl border border-white/20 cursor-pointer hover:scale-105 transition"
                onClick={() => setShowPreview(true)}
              />
              {showPreview && (
                <div
                  className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50"
                  onClick={() => setShowPreview(false)}
                >
                  <img
                    src={thumbnailUrl}
                    alt="Full thumbnail"
                    className="max-h-[90vh] rounded-xl shadow-xl"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Upload