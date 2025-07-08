import { useState, useEffect, ChangeEvent, useRef } from 'react'
import { toast } from 'sonner'

import { useUser } from '@/hooks/useUser'
import { cn } from '@/lib/utils'

import { updateUserProfile, uploadAvatar, deleteAccount } from '@/api/users'
import type { AvatarUploadResponse } from '@/api/users'

import { Box } from 'lucide-react'
import GlassNavbar from '@/components/ui/GlassNavbar'

const themes = ['system', 'light', 'dark'] as const
type Theme = typeof themes[number]

export default function Settings() {
  const { user, loading, isAdmin, setUser } = useUser()
  const [theme, setTheme] = useState<Theme>('system')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const bioRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as Theme) || 'system'
    setTheme(saved)
    if (user?.bio) setBio(user.bio)
    if (user?.avatar_url) setUser({ ...user })
    if (!user?.bio && bioRef.current) {
      bioRef.current.focus()
    }
  }, [user, setUser])

  const handleThemeChange = (val: Theme) => {
    setTheme(val)
    localStorage.setItem('theme', val)
    document.documentElement.classList.remove('light', 'dark')
    if (val === 'light') document.documentElement.classList.add('light')
    if (val === 'dark') document.documentElement.classList.add('dark')
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    const prevBio = user?.bio
    setUser({ ...user!, bio })
    try {
      await updateUserProfile({ bio })
      toast.success('✅ Profile updated')
    } catch {
      setUser({ ...user!, bio: prevBio })
      toast.error('❌ Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    try {
      const res: AvatarUploadResponse | null = await uploadAvatar(file)
      if (res) {
        setUser({ ...user!, avatar_url: res.avatar_url, thumbnail_url: res.thumbnail_url })
        toast.success('✅ Avatar updated')
      }
    } catch {
      toast.error('❌ Failed to upload avatar')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete || deleting) return
    setDeleting(true)
    try {
      await deleteAccount()
      toast.success('✅ Account deleted')
      window.location.href = '/'
    } catch {
      toast.error('❌ Failed to delete account')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <>
        <GlassNavbar floating={false} />
        <div className="max-w-4xl mx-auto pt-20 px-4 space-y-8 animate-pulse">
          <div className="h-8 bg-zinc-300 rounded w-1/3"></div>
          <div className="h-16 bg-zinc-200 rounded"></div>
          <div className="h-48 bg-zinc-200 rounded"></div>
        </div>
      </>
    )
  }

  return (
    <>
      <GlassNavbar floating={false} />
      <div className="max-w-4xl mx-auto pt-20 px-4 space-y-8">
        <h1 className="text-3xl font-semibold mb-4 flex items-center gap-2">
          <Box className="w-6 h-6 text-primary" />
          User Settings
        </h1>

        {/* Avatar */}
        <div className="glass-card">
          <h2 className="text-xl font-medium mb-4">Profile Picture</h2>
          <div className="flex items-center gap-4">
            {uploadingAvatar ? (
              <div className="w-16 h-16 rounded-full bg-zinc-200 animate-pulse" />
            ) : user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover border"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-zinc-300 flex items-center justify-center text-white">
                {user.username?.[0] ?? '?'}
              </div>
            )}
            <label
              className="cursor-pointer text-sm underline text-primary"
              aria-label="Change profile picture"
            >
              Change…
              <input type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
            </label>
          </div>
        </div>

        {/* Bio */}
        <div className="glass-card">
          <h2 className="text-xl font-medium mb-4">Public Bio</h2>
          <textarea
            ref={bioRef}
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full p-3 rounded-md border text-sm dark:bg-zinc-800"
            rows={3}
            maxLength={140}
            placeholder="Tell others about your maker vibe…"
          />
          <div className="flex justify-between mt-3">
            <div className="text-xs">{bio.length}/140</div>
            <button
              disabled={saving}
              onClick={handleSave}
              className="px-4 py-2 text-sm rounded-md bg-zinc-900 text-white disabled:opacity-50 flex items-center gap-2"
            >
              {saving && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Theme */}
        <div className="glass-card">
          <h2 className="text-xl font-medium mb-4">Theme</h2>
          <div className="flex gap-3">
            {themes.map(t => (
              <button
                key={t}
                onClick={() => handleThemeChange(t)}
                className={cn(
                  'px-4 py-2 rounded-full border text-sm transition',
                  theme === t
                    ? 'bg-zinc-900 text-white'
                    : 'bg-transparent border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                )}
                aria-pressed={theme === t}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl bg-red-50 p-6">
          <h2 className="text-xl font-semibold text-red-700 mb-4">Danger Zone</h2>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-red-600">⚠️ This action is irreversible.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {deleting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {deleting ? 'Deleting…' : 'Confirm Deletion'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}