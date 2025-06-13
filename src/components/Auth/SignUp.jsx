import { useState } from 'react'
import axios from '../../api/axios'
import toast from 'react-hot-toast'
import { saveToken } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function SignUp() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    image: null,
  })

  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic client-side validation
    if (!form.username.trim() || !form.email.trim() || !form.password) {
      toast.error('All fields except image are required')
      return
    }

    const data = new FormData()
    Object.entries(form).forEach(([key, val]) => {
      if (val !== null) data.append(key, val)
    })

    try {
      setLoading(true)
      const res = await axios.post('/auth/signup', data)
      const { token, user } = res.data

      saveToken(token)
      setAuth(user, token)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.detail || 'Sign-up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-xl">
      <h2 className="text-2xl font-semibold text-center mb-4">Create Account</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-400"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-400"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-400"
          required
        />
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  )
}