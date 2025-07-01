import { useEffect, useState, ChangeEvent } from 'react'
import { useUser } from '@/hooks/useUser'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import { updateUserProfile, uploadAvatar } from '@/api/users'
import { toast } from 'sonner'

const themes = ['system', 'light', 'dark'] as const
type Theme = typeof themes[number]

export default function Settings() {
  const { user, loading, isAdmin } = useUser()
  const [theme, setTheme] = useState<Theme>('system')
  const [bio, setBio] = useState<string>('')
  const [saving, setSaving] = useState<boolean>(false)
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as Theme) || 'system'
    setTheme(saved)
    if (user?.bio) setBio(user.bio)
    console.debug('[Settings] Loaded theme + bio from state')
  }, [user])

  const handleThemeChange = (val: Theme) => {
    setTheme(val)
    localStorage.setItem('theme', val)
    console.debug('[Settings] Theme updated:', val)
    document.documentElement.classList.remove('light', 'dark')
    if (val === 'light') document.documentElement.classList.add('light')
    if (val === 'dark') document.documentElement.classList.add('dark')
  }

  const handleDelete = () => {
    console.warn('[Settings] User requested account deletion:', user)
    alert('Account deletion not implemented. Stub.')
  }

  const handleSave = async () => {
    console.debug('[Settings] Submitting bio to backend…')
    setSaving(true)
    try {
      const res = await updateUserProfile({ bio })
      console.info('[Settings] Bio saved:', res.data)
      toast.success('Profile updated')
    } catch (err) {
      console.error('[Settings] Failed to update profile:', err)
      toast.error('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    console.debug('[Settings] Uploading avatar:', file)
    try {
      const res = await uploadAvatar(file)
      console.info('[Settings] Avatar uploaded:', res.data)
      toast.success('Avatar updated')
      window.location.reload()
    } catch (err) {
      console.error('[Settings] Avatar upload failed:', err)
      toast.error('Avatar upload failed')
    }
  }

  return (
    <div className="max-w-4xl mx-auto pt-20 px-4 space-y-8">
      <h1 className="text-3xl font-semibold mb-2">User Settings</h1>

      {loading && <p className="text-muted-foreground">Loading user settings…</p>}

      {!loading && user && (
        <>
          {/* Avatar Upload */}
          <div className="glass-card">
            <h2 className="text-xl font-medium mb-4">Profile Picture</h2>
            <div className="flex items-center gap-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-16 h-16 rounded-full object-cover border border-zinc-300 dark:border-zinc-600"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-zinc-300 dark:bg-zinc-700 text-center flex items-center justify-center text-white text-sm font-semibold">
                  {user.username?.[0] ?? '?'}
                </div>
              )}
              <label className="cursor-pointer text-sm font-medium underline text-primary">
                Change…
                <input type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
              </label>
            </div>
          </div>

          {/* Account Info */}
          <div className="glass-card">
            <h2 className="text-xl font-medium mb-4">Account Info</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><label className="block text-zinc-500">Username</label><div>{user.username}</div></div>
              <div><label className="block text-zinc-500">Email</label><div>{user.email}</div></div>
              <div><label className="block text-zinc-500">Role</label><div>{isAdmin ? 'Admin' : 'User'}</div></div>
              <div><label className="block text-zinc-500">Verified</label><div>{user.is_verified ? 'Yes' : 'No'}</div></div>
              <div><label className="block text-zinc-500">Last Login</label><div>{user.last_login || 'Unknown'}</div></div>
            </div>
          </div>

          {/* Theme */}
          <div className="glass-card">
            <h2 className="text-xl font-medium mb-4">Theme</h2>
            <div className="flex gap-3">
              {themes.map((t) => (
                <button
                  key={t}
                  onClick={() => handleThemeChange(t)}
                  className={cn(
                    'px-4 py-2 rounded-full border text-sm',
                    theme === t
                      ? 'bg-zinc-900 text-white dark:bg-white/10 border-zinc-900 dark:border-zinc-300'
                      : 'bg-transparent border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                  )}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="glass-card">
            <h2 className="text-xl font-medium mb-4">Public Bio</h2>
            <textarea
              value={bio}
              onChange={(e) => {
                setBio(e.target.value)
                console.debug('[Settings] Bio updated:', e.target.value)
              }}
              className="w-full p-3 rounded-md border border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-sm"
              rows={3}
              maxLength={140}
              placeholder="Tell others about your maker vibe (max 140 chars)…"
            />
            <div className="flex justify-between mt-3">
              <div className="text-xs text-zinc-400">{bio.length}/140</div>
              <button
                disabled={saving}
                onClick={handleSave}
                className="px-4 py-2 text-sm rounded-md bg-zinc-900 text-white dark:bg-white/10 hover:bg-zinc-700 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-xl bg-red-50 dark:bg-zinc-900/70 backdrop-blur shadow border border-red-200 dark:border-red-500 p-6">
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-4">Danger Zone</h2>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-red-600">This action is irreversible.</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg"
                  >
                    Confirm Deletion
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-4 py-2 bg-zinc-300 hover:bg-zinc-400 text-black dark:bg-zinc-600 dark:text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}