import { useEffect, useRef, useState, ChangeEvent, DragEvent, FormEvent } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import GlassCard from '@/components/ui/GlassCard'
import { toast } from 'sonner'
import axios from '@/api/axios'
import ModelPreview from '@/components/ui/ModelPreview'

type RenderStatus = 'pending' | 'processing' | 'complete' | 'failed' | null

export default function Uploads() {
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [renderStatus, setRenderStatus] = useState<RenderStatus>(null)

  useEffect(() => {
    return () => {
      setFile(null)
    }
  }, [])

  const handleFileChange = (f: File) => {
    if (!['model/stl', 'application/octet-stream'].includes(f.type) && !f.name.endsWith('.stl') && !f.name.endsWith('.3mf')) {
      toast.error('Invalid file type. Only STL or 3MF allowed.')
      return
    }
    if (f.size > 50 * 1024 * 1024) {
      toast.error('File is too large (max 50MB).')
      return
    }

    setFile(f)
    if (!name) setName(f.name.replace(/\.[^/.]+$/, ''))
    console.debug('[Uploads] File selected:', f)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFileChange(dropped)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const pollRenderStatus = async (uploadId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/upload/status/${uploadId}`)
        const status: RenderStatus = res.data.status
        setRenderStatus(status)
        if (status === 'complete' || status === 'failed') {
          clearInterval(interval)
          toast.success(`Render ${status}`)
        }
      } catch {
        clearInterval(interval)
        toast.error('Failed to poll render status')
      }
    }, 3000)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please select a file to upload')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'model')
    formData.append('name', name)
    formData.append('description', description)

    setUploading(true)
    setProgress(0)

    try {
      const res = await axios.post('/api/v1/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (evt.total) {
            const percent = Math.round((evt.loaded * 100) / evt.total)
            setProgress(percent)
          }
        },
      })

      const { id } = res.data
      toast.success('Upload complete, rendering started')
      pollRenderStatus(id)

      setFile(null)
      setName('')
      setDescription('')
    } catch (err) {
      toast.error('Upload failed')
      console.error(err)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const handleReset = () => {
    setFile(null)
    setName('')
    setDescription('')
    setProgress(0)
    setUploading(false)
    setRenderStatus(null)
  }

  return (
    <PageLayout title="Upload 3D Model">
      <GlassCard>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="w-full border-2 border-dashed border-zinc-400 rounded-lg p-6 text-center dark:border-zinc-600 mb-4"
        >
          <p className="text-zinc-600 dark:text-zinc-400 mb-2">
            Drag and drop an STL or 3MF file here
          </p>
          <input
            type="file"
            accept=".stl,.3mf"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files?.[0]) handleFileChange(e.target.files[0])
            }}
            className="w-full"
          />
        </div>

        {file && (
          <div className="mb-4 text-center">
            <p className="text-sm mb-2 text-zinc-500">Selected Preview:</p>
            <ModelPreview
              file={file}
              width={300}
              height={300}
              background="#f8fafc"
            />
            <p className="text-xs mt-1 text-zinc-500">{file.name}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-zinc-800"
              placeholder="Model name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-zinc-800"
              rows={3}
              placeholder="Model description (optional)"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 bg-zinc-900 text-white py-2 rounded-md hover:bg-zinc-800 disabled:opacity-50"
            >
              {uploading ? 'Uploading…' : 'Upload Model'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={uploading}
              className="flex-1 bg-zinc-200 text-zinc-700 py-2 rounded-md hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
            >
              Reset
            </button>
          </div>
        </form>

        {uploading && (
          <div className="mt-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Progress: {progress}%</p>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded">
              <div
                className="h-2 bg-blue-600 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {renderStatus && (
          <div className="mt-6 text-sm text-center text-zinc-700 dark:text-zinc-300">
            <p>
              Render Status: <strong>{renderStatus}</strong>
            </p>
          </div>
        )}
      </GlassCard>
    </PageLayout>
  )
}