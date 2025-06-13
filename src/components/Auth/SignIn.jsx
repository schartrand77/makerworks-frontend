import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../../api/axios'
import { saveToken } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email.trim() || !form.password) {
      toast.error('Email and password are required')
      return
    }

    try {
      setLoading(true)
      const res = await axios.post('/auth/signin', form)
      const { token, user } = res.data

      saveToken(token)
      setAuth(user, token)
      toast.success(`Welcome back, ${user.username}!`)
      navigate(from, { replace: true })
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.detail || 'Sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-xl">
      <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-400"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-400"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}