// src/components/settings/AvatarSection.tsx
import { useRef, useState, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import axios from '@/api/axios'
import { toast } from 'sonner'

export default function AvatarSection() {
  const { user, token, setUser, fetchUser } = useAuthStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!user && token) {
      fetchUser()
    }
  }, [user, token, fetchUser])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'multipart/form-data',
      }
      if (token) headers.Authorization = `Bearer ${token}`

      console.group('[Avatar Upload Debug]')
      console.log('Uploading file:', file.name, file.type, file.size)
      console.log('Endpoint:', '/avatar')
      console.log('Token:', token)
      console.log('User:', user)
      console.log('Headers to send:', headers)
      console.groupEnd()

      const res = await axios.post('/avatar', formData, {
        headers,
        withCredentials: true,
      })

      console.log('[Avatar Upload Response]', res.status, res.data)

      if (res.data?.avatar_url) {
        setUser({ ...user, avatar_url: res.data.avatar_url })
        await fetchUser(true)
        toast.success('✅ Avatar updated!')
      } else {
        toast.error('❌ Upload failed: no avatar URL returned')
      }
    } catch (err: any) {
      console.error('[Avatar Upload Error]', err.response?.data || err.message)

      // 🔍 Dump everything we can from the error
      if (err.response) {
        console.group('[Avatar Upload Error Detail]')
        console.log('Status:', err.response.status)
        console.log('Data:', err.response.data)
        console.log('Headers:', err.response.headers)
        console.groupEnd()
      }

      if (err.response?.status === 401) {
        toast.error('🔒 Unauthorized. Please sign in again.')
      } else if (err.response?.status === 500) {
        toast.error(`❌ Server error: ${err.response?.data?.detail || 'Avatar render failed'}`)
      } else {
        toast.error('❌ Upload failed')
      }
    } finally {
      setUploading(false)
    }
  }

  const handleClick = () => fileRef.current?.click()

  return (
    <div className="flex flex-col items-center gap-6">
      <img
        src={user?.avatar_url || '/default-avatar.jpg'}
        alt="avatar"
        className="w-28 h-28 rounded-full border border-white/30 shadow-inner object-cover"
      />
      <input
        type="file"
        ref={fileRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={handleClick}
        disabled={uploading}
        className="px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all disabled:opacity-50"
      >
        {uploading ? 'Uploading…' : 'Change Avatar'}
      </button>
    </div>
  )
}
