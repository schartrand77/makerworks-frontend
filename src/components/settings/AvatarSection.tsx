// src/components/settings/AvatarSection.tsx

import { useRef, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import axios from '@/api/axios'
import { toast } from 'sonner'

export default function AvatarSection() {
  const { user, setUser } = useAuthStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post('/users/avatar', formData)
      setUser({ ...user, avatar_url: res.data.avatar_url })
      toast.success('✅ Avatar updated!')
    } catch (err) {
      toast.error('❌ Upload failed')
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
