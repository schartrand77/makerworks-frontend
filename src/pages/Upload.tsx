import { useEffect, useRef, useState, ChangeEvent, DragEvent, FormEvent } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import GlassCard from '@/components/ui/GlassCard'
import { toast } from 'sonner'
import axios from '@/api/axios'

type RenderStatus = 'pending' | 'processing' | 'complete' | 'failed' | null

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [uploading, setUploading] = useState<boolean>(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [renderStatus, setRenderStatus] = useState<RenderStatus>(null)
  const dropzoneRef = useRef<HTMLDivElement | null>(null)

  const handleFileChange = (f: File) => {
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    if (!name) setName(f.name.replace(/\.[^/.]+$/, ''))
    console.debug('[Upload] File selected:', f)
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
    console.debug('[Upload] Polling render status for ID:', uploadId)
    const poll = async () => {
      try {
        const res = await axios.get(`/upload/status/${uploadId}`)
        const status: RenderStatus = res.data.status
        setRenderStatus(status)
        console.info('[Upload] Render status:', status)
        if (status === 'complete') {
          toast.success('Model render complete')
          clearInterval(interval)
        }
      } catch (err) {
        console.error('[Upload] Poll failed:', err)
        toast.error('Render status polling failed')
        clearInterval(interval)
      }
    }
    const interval = setInterval(poll, 3000)
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

    console.debug('[Upload] Submitting upload:', { name, description, file })

    try {
      setUploading(true)
      const res = await axios.post('/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const { id, url, uploaded_at } = res.data
      console.info('[Upload] Upload complete:', res.data)

      toast.success('Model uploaded successfully')
      setFile(null)
      setPreviewUrl(null)
      setName('')
      setDescription('')
      pollRenderStatus(id)
    } catch (err) {
      console.error('[Upload] Upload failed:', err)
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <PageLayout title="Upload 3D Model">
      <GlassCard>
        <div
          ref={dropzoneRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="w-full border-2 border-dashed border-zinc-400 rounded-lg p-6 text-center dark:border-zinc-600 mb-4"
        >
          <p className="text-zinc-600 dark:text-zinc-400 mb-2">Drag and drop an STL or 3MF file here</p>
          <input
            type="file"
            accept=".stl,.3mf"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files?.[0]) handleFileChange(e.target.files[0])
            }}
            className="w-full"
          />
        </div>

        {previewUrl && (
          <div className="mb-4 text-center">
            <p className="text-sm mb-2 text-zinc-500">Selected:</p>
            <img
              src={previewUrl}
              alt="preview"
              className="w-32 h-32 mx-auto object-contain border border-zinc-300 dark:border-zinc-700 rounded-lg"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                console.debug('[Upload] Name updated:', e.target.value)
              }}
              className="w-full p-2 border rounded-md dark:bg-zinc-800"
              placeholder="Model name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                console.debug('[Upload] Description updated:', e.target.value)
              }}
              className="w-full p-2 border rounded-md dark:bg-zinc-800"
              rows={3}
              placeholder="Model description (optional)"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-zinc-900 text-white py-2 rounded-md hover:bg-zinc-800"
          >
            {uploading ? 'Uploading…' : 'Upload Model'}
          </button>
        </form>

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