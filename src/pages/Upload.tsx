// src/pages/Upload.tsx

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import toast, { Toaster } from 'react-hot-toast'
import axios from '@/api/axios'
import { useAuthStore } from '@/store/useAuthStore'

const allowedExtensions = ['stl', '3mf', 'obj']

const UploadPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [rejectedFiles, setRejectedFiles] = useState<string[]>([])
  const { user, token } = useAuthStore()

  const onDrop = useCallback((acceptedFiles: File[], fileRejections) => {
    setRejectedFiles([])
    setSelectedFile(null)
    setProgress(0)

    if (!acceptedFiles.length) {
      toast.error('❌ No valid file selected.')
      const names = fileRejections.map((rej) => rej.file.name)
      setRejectedFiles(names)
      return
    }

    const file = acceptedFiles[0]
    const ext = file.name.split('.').pop()?.toLowerCase()

    if (!allowedExtensions.includes(ext || '')) {
      toast.error(`❌ Invalid file: ${file.name}. Allowed: ${allowedExtensions.join(', ')}`)
      setRejectedFiles([file.name])
      return
    }

    setSelectedFile(file)
    setLoading(true)

    uploadModelWithProgress(file)
      .then((res) => {
        toast.success('✅ Model uploaded.')
        setSelectedFile(null)
        setProgress(0)
      })
      .catch(() => toast.error(`❌ Upload failed.`))
      .finally(() => setLoading(false))
  }, [])

  const uploadModelWithProgress = async (file: File) => {
    if (!token) {
      toast.error('❌ Not authenticated.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    return axios.post(`/api/v1/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      },
      onUploadProgress: (e: ProgressEvent) => {
        if (e.total) setProgress(Math.round((e.loaded / e.total) * 100))
      }
    })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: loading,
    accept: {
      'model/stl': ['.stl'],
      'application/octet-stream': ['.3mf', '.obj']
    }
  })

  return (
    <div className="upload-container" style={{ maxWidth: '640px', margin: '2rem auto', color: '#d1d5db' }}>
      <Toaster position="top-right" />
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Upload a 3D Model</h2>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
        style={{
          border: '2px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(18px) saturate(180%)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
          color: '#d1d5db'
        }}
      >
        <input {...getInputProps()} />
        <p>
          {isDragActive ? 'Drop your model here…' : 'Drag and drop your model file or click to browse.'}
          <br />
          <strong>Accepted: .stl, .3mf, .obj</strong>
        </p>
      </div>

      {selectedFile && (
        <div
          style={{
            marginTop: '1.25rem',
            padding: '1rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            color: '#d1d5db'
          }}
        >
          <p>
            📦 <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)
          </p>
          {loading && (
            <div style={{ height: '10px', background: '#333', borderRadius: '5px', marginTop: '0.5rem' }}>
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #60a5fa, #38bdf8)',
                  transition: 'width 0.2s ease'
                }}
              />
            </div>
          )}
        </div>
      )}

      {loading && (
        <p style={{ textAlign: 'center', marginTop: '1em' }}>
          Uploading… <strong>{progress}%</strong>
        </p>
      )}

      {rejectedFiles.length > 0 && (
        <div style={{ color: '#f87171', marginTop: '1em', textAlign: 'center' }}>
          <p>🚫 Rejected:</p>
          <ul>
            {rejectedFiles.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default UploadPage
