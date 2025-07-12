import { useState, useEffect, ChangeEvent, useRef } from 'react'
import { toast } from 'sonner'

import { useUser } from '@/hooks/useUser'
import { cn } from '@/lib/utils'

import { updateUserProfile, uploadAvatar, deleteAccount } from '@/api/users'
import type { AvatarUploadResponse } from '@/api/users'

import { Box } from 'lucide-react'

const themes = ['system', 'light', 'dark'] as const
type Theme = typeof themes[number]

export default function Settings() {
  const { user, loading, isAdmin, setUser } = useUser()
  const [theme, setTheme] = useState<Theme>('system')
  const [bio, setBio] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const bioRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as Theme) || 'system'
    setTheme(saved)
    if (user?.bio) setBio(user.bio)
    if (user?.username) setUsername(user.username)
    if (user?.email) setEmail(user.email)
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

  const handleBioSave = async () => {
    if (saving) return
    setSaving(true)
    const prevBio = user?.bio
    setUser({ ...user!, bio })
    try {
      await updateUserProfile({ bio })
      toast.success('✅ Bio updated')
    } catch {
      setUser({ ...user!, bio: prevBio })
      toast.error('❌ Failed to save bio')
    } finally {
      setSaving(false)
    }
  }

  const handleProfileSave = async () => {
    if (saving) return
    setSaving(true)
    const prevUser = { ...user! }
    setUser({ ...user!, username, email })
    try {
      await updateUserProfile({ username, email })
      toast.success('✅ Profile updated')
    } catch {
      setUser(prevUser)
      toast.error('❌ Failed to save profile')
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
      <div className="max-w-4xl mx-auto pt-20 px-4 space-y-8 animate-pulse">
        <div className="h-8 bg-zinc-300 rounded w-1/3"></div>
        <div className="h-16 bg-zinc-200 rounded"></div>
        <div className="h-48 bg-zinc-200 rounded"></div>
      </div>
    )
  }

  return (
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

      {/* Profile Info */}
      <div className="glass-card">
        <h2 className="text-xl font-medium mb-4">Profile Info</h2>

        <div className="grid gap-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-3 rounded-md border text-sm dark:bg-zinc-800 backdrop-blur bg-white/10"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 rounded-md border text-sm dark:bg-zinc-800 backdrop-blur bg-white/10"
          />
          <button
            disabled={saving}
            onClick={handleProfileSave}
            className="px-4 py-2 text-sm rounded-full backdrop-blur bg-zinc-900/30 text-white disabled:opacity-50 flex items-center gap-2 shadow"
          >
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </div>

      {/* Bio */}
      <div className="glass-card">
        <h2 className="text-xl font-medium mb-4">Public Bio</h2>
        <textarea
          ref={bioRef}
          value={bio}
          onChange={e => setBio(e.target.value)}
          className="w-full p-3 rounded-md border text-sm dark:bg-zinc-800 backdrop-blur bg-white/10"
          rows={3}
          maxLength={140}
          placeholder="Tell others about your maker vibe…"
        />
        <div className="flex justify-between mt-3">
          <div className="text-xs">{bio.length}/140</div>
          <button
            disabled={saving}
            onClick={handleBioSave}
            className="px-4 py-2 text-sm rounded-full backdrop-blur bg-zinc-900/30 text-white disabled:opacity-50 flex items-center gap-2 shadow"
          >
            {saving ? 'Saving…' : 'Save Bio'}
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
                'px-4 py-2 rounded-full border text-sm transition backdrop-blur shadow',
                theme === t
                  ? 'bg-zinc-900/50 text-white'
                  : 'bg-transparent border-zinc-300/30 text-zinc-700 dark:text-zinc-300 hover:bg-white/10'
              )}
              aria-pressed={theme === t}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="
        rounded-xl p-6
        backdrop-blur-xl
        bg-red-500/10 dark:bg-red-900/20
        shadow-inner
        border border-red-500/20 dark:border-red-700/30
      ">
        <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-4">Danger Zone</h2>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="
              px-4 py-2 rounded-full
              backdrop-blur
              bg-red-500/20 dark:bg-red-700/30
              text-red-800 dark:text-red-200
              border border-red-500/30 dark:border-red-700/40
              shadow hover:bg-red-500/30 dark:hover:bg-red-700/50
              transition
            "
          >
            Delete Account
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-red-600 dark:text-red-300">⚠️ This action is irreversible.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="
                  px-4 py-2 rounded-full
                  backdrop-blur
                  bg-red-600/20 dark:bg-red-700/30
                  text-red-800 dark:text-red-200
                  border border-red-600/30 dark:border-red-700/40
                  shadow hover:bg-red-600/30 dark:hover:bg-red-700/50
                  disabled:opacity-50
                "
              >
                {deleting ? 'Deleting…' : 'Confirm Deletion'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="
                  px-4 py-2 rounded-full
                  backdrop-blur
                  bg-white/10 dark:bg-zinc-800/20
                  text-black dark:text-white
                  border border-white/10 dark:border-zinc-700/30
                  shadow hover:bg-white/20 dark:hover:bg-zinc-700/40
                "
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
