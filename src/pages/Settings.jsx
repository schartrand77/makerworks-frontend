import { useEffect, useRef, useState } from 'react'
import GlassCard from '../components/GlassCard'
import GlassButton from '../components/GlassButton'
import GlassToggle from '../components/GlassToggle'

export default function Settings() {
  const token = localStorage.getItem('token')
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const fileInputRef = useRef()

  useEffect(() => {
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setUser)
      .finally(() => setLoading(false))
  }, [])

  const updateUser = async () => {
    const res = await fetch('/api/users/me', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    if (res.ok) setStatus('✅ Saved')
    else setStatus('❌ Error saving')
  }

  const deleteAccount = async () => {
    if (!confirm("This cannot be undone. Delete your account?")) return
    await fetch('/api/users/me', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    localStorage.clear()
    window.location.href = "/"
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/users/me/avatar', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })

    if (res.ok) {
      const url = await res.text()
      setUser({ ...user, avatar: url })
      setAvatarPreview(url)
      setStatus('✅ Avatar updated')
    } else {
      setStatus('❌ Failed to upload avatar')
    }
  }

  if (loading) return <div className="text-center mt-12">Loading settings...</div>
  if (!user) return <div className="text-center text-red-500 mt-12">Unable to load user data.</div>

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">⚙️ Settings</h1>

      {/* Profile Info */}
      <GlassCard className="space-y-4">
        <h2 className="text-xl font-semibold">Profile</h2>
        <input
          type="text"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          placeholder="Username"
          className="w-full p-2 rounded"
        />
        <input
          type="text"
          value={user.bio || ''}
          onChange={(e) => setUser({ ...user, bio: e.target.value.slice(0, 140) })}
          placeholder="Short bio (max 140 characters)"
          className="w-full p-2 rounded"
        />
        <p className="text-xs text-white/60">
          {user.bio?.length || 0}/140 characters
        </p>

        <div className="flex items-center gap-4">
          {avatarPreview || user.avatar ? (
            <img
              src={avatarPreview || user.avatar}
              alt="Avatar preview"
              className="w-16 h-16 rounded-full border"
            />
          ) : null}
          <GlassButton onClick={() => fileInputRef.current.click()}>
            Upload Avatar
          </GlassButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleAvatarUpload}
          />
        </div>

        <div className="flex justify-between items-center">
          <GlassButton onClick={updateUser}>Save Changes</GlassButton>
          {status && <span className="text-white/60">{status}</span>}
        </div>
      </GlassCard>

      {/* Appearance */}
      <GlassCard className="space-y-4">
        <h2 className="text-xl font-semibold">Appearance</h2>
        <GlassToggle
          label="Dark Mode"
          enabled={user.theme === 'dark'}
          setEnabled={(val) => setUser({ ...user, theme: val ? 'dark' : 'light' })}
        />
        <p className="text-sm text-white/50">Toggle between light and dark UI.</p>
      </GlassCard>

      {/* Danger Zone */}
      <GlassCard className="space-y-4 border border-red-400">
        <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
        <GlassButton onClick={deleteAccount} className="bg-red-500 hover:bg-red-600">
          Delete My Account
        </GlassButton>
      </GlassCard>
    </div>
  )
}