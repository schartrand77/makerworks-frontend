import { useEffect, useState } from 'react'
import axios from '../api/axios'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/useAuthStore'

export default function Settings() {
  const { user, setUser, fetchUser, isLoading } = useAuthStore()
  const [form, setForm] = useState({
    username: '',
    avatar: '',
    language: 'en',
    theme: 'system',
  })

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        avatar: user.avatar || '',
        language: user.language || 'en',
        theme: user.theme || 'system',
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const res = await axios.patch('/users/me', form)
      setUser(res.data)
      toast.success('Settings updated')
    } catch {
      toast.error('Failed to update settings')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your account?')) return
    try {
      await axios.delete('/users/me')
      toast.success('Account deleted')
      window.location.href = '/signout'
    } catch {
      toast.error('Could not delete account')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading settings...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>You must be signed in to access settings.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-10 text-white bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-center mb-4">User Settings</h1>

        <div className="space-y-4">
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            onBlur={handleSave}
            className="w-full px-3 py-2 rounded bg-white/10 border border-white/20"
          />

          <label className="block text-sm font-medium">Avatar URL</label>
          <input
            type="text"
            name="avatar"
            value={form.avatar}
            onChange={handleChange}
            onBlur={handleSave}
            className="w-full px-3 py-2 rounded bg-white/10 border border-white/20"
          />
          {form.avatar && (
            <img
              src={form.avatar}
              alt="avatar"
              className="w-16 h-16 rounded-full border"
            />
          )}

          <label className="block text-sm font-medium">Theme</label>
          <select
            name="theme"
            value={form.theme}
            onChange={handleChange}
            onBlur={handleSave}
            className="w-full px-3 py-2 rounded bg-white/10 border border-white/20"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>

          <label className="block text-sm font-medium">Language</label>
          <select
            name="language"
            value={form.language}
            onChange={handleChange}
            onBlur={handleSave}
            className="w-full px-3 py-2 rounded bg-white/10 border border-white/20"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="es">Spanish</option>
          </select>
        </div>

        <div className="text-sm text-gray-300 space-y-1">
          <p>Last Login: {user?.last_login}</p>
          <p>Created At: {user?.created_at}</p>
        </div>

        <button
          onClick={handleDelete}
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          Delete My Account
        </button>
      </div>
    </div>
  )
}