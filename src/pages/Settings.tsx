import { useState, useEffect, useRef, ChangeEvent } from 'react'
import { toast } from 'sonner'
import { Box } from 'lucide-react'

import { useUser } from '@/hooks/useUser'
import { cn } from '@/lib/utils'
import { updateUserProfile, uploadAvatar, deleteAccount } from '@/api/users'
import type { AvatarUploadResponse } from '@/api/users'

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
    if (!file) {
      toast.error('❌ No file selected')
      return
    }

    setUploadingAvatar(true)
    try {
      const res: AvatarUploadResponse | null = await uploadAvatar(file)
      if (res) {
        // force avatar refresh by replacing avatar_url with cache-busted URL from server
        setUser({
          ...user!,
          avatar_url: res.avatar_url,
          thumbnail_url: res.thumbnail_url,
        })
        toast.success('✅ Avatar updated successfully')
      } else {
        toast.error('❌ Failed to upload avatar — no response from server')
      }
    } catch (err) {
      console.error(err)
      toast.error('❌ Failed to upload avatar — unexpected error')
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
      <div className="flex justify-center items-center min-h-screen animate-pulse">
        <div className="h-8 bg-zinc-300 rounded w-1/3"></div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="glass-card w-full max-w-2xl space-y-6 p-6">
        <h1 className="text-3xl font-semibold flex items-center gap-2 text-white/90">
          <Box className="w-6 h-6 text-primary" />
          User Settings
        </h1>

        {/* Avatar */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Profile Picture</h2>
          <div className="flex items-center gap-4">
            {uploadingAvatar ? (
              <div className="w-16 h-16 rounded-full bg-zinc-200 animate-pulse" />
            ) : user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover border shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-zinc-300 flex items-center justify-center text-white shadow-inner">
                {user.username?.[0] ?? '?'}
              </div>
            )}
            <label className="cursor-pointer text-sm underline text-primary">
              Change…
              <input type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
            </label>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* Profile Info */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Profile Info</h2>
          <div className="grid gap-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full p-3 rounded-md border text-sm dark:bg-zinc-800 backdrop-blur bg-white/10 shadow-inner"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 rounded-md border text-sm dark:bg-zinc-800 backdrop-blur bg-white/10 shadow-inner"
            />
            <button
              disabled={saving}
              onClick={handleProfileSave}
              className="px-4 py-2 text-sm rounded-full backdrop-blur bg-zinc-900/30 text-white disabled:opacity-50 flex items-center gap-2 shadow hover:scale-105 transition"
            >
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* Bio */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Public Bio</h2>
          <textarea
            ref={bioRef}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 rounded-md border text-sm dark:bg-zinc-800 backdrop-blur bg-white/10 shadow-inner"
            rows={3}
            maxLength={140}
            placeholder="Tell others about your maker vibe…"
          />
          <div className="flex justify-between mt-3">
            <div className="text-xs">{bio.length}/140</div>
            <button
              disabled={saving}
              onClick={handleBioSave}
              className="px-4 py-2 text-sm rounded-full backdrop-blur bg-zinc-900/30 text-white disabled:opacity-50 flex items-center gap-2 shadow hover:scale-105 transition"
            >
              {saving ? 'Saving…' : 'Save Bio'}
            </button>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* Theme */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Theme</h2>
          <div className="flex gap-3">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => handleThemeChange(t)}
                className={cn(
                  'px-4 py-2 rounded-full border text-sm transition backdrop-blur shadow hover:scale-105',
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
        </section>

        <hr className="border-white/10" />

        {/* Danger Zone */}
        <section>
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">Danger Zone</h2>
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
        </section>
      </div>
    </div>
  )
}
