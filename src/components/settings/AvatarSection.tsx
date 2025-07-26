// src/components/settings/AvatarSection.tsx
import { useRef, useState, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import axios from '@/api/axios'
import { toast } from 'sonner'

export default function AvatarSection() {
  const { user, token, fetchUser } = useAuthStore()
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

      const res = await axios.post('/avatar', formData, {
        headers,
        withCredentials: true,
      })

      if (res.data?.avatar_url) {
        toast.success('✅ Avatar updated!')
        await fetchUser(true)
      } else {
        toast.error('❌ Upload failed: no avatar URL returned')
      }
    } catch (err: any) {
      console.error('[Avatar Upload Error]', err)
      toast.error('❌ Avatar upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
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
