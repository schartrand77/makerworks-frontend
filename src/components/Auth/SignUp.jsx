import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import GlassCard from '../ui/GlassCard'
import Button from '../ui/Button'
import { useAuthStore } from '../../store/useAuthStore'

export default function AuthPage() {
  const [form, setForm] = useState({ email: '', password: '', username: '' })
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const { user, signin, signup } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true })
    }
  }, [user, navigate, from])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.email.trim() || !form.password.trim()) {
      toast.error('Email and password are required')
      return
    }

    if (isSignUp && !form.username.trim()) {
      toast.error('Username is required for sign up')
      return
    }

    try {
      setLoading(true)

      const success = isSignUp
        ? await signup({ email: form.email, password: form.password, username: form.username }, navigate)
        : await signin(form.email, form.password, navigate)

      if (!success) {
        toast.error(isSignUp ? 'Sign-up failed' : 'Sign-in failed')
      }
    } catch (err) {
      console.error('[auth] Sign-in/up failed:', err)
      const msg = err?.response?.data?.detail || (isSignUp ? 'Sign-up failed' : 'Sign-in failed')
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        <GlassCard
          size="expanded"
          theme="auto"
          elevation="glass"
          hoverEffect
          ripple
          focusRing
          className="w-full text-center"
        >
          <h2 className="text-2xl font-bold mb-2 text-white">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          <p className="text-white/60 mb-4">
            {isSignUp ? 'Sign up to get started with MakerWorks' : 'Enter your credentials below'}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <input
                name="username"
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-400"
              />
            )}
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
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              theme="auto"
              variant="solid"
              className="w-full"
            >
              {loading
                ? isSignUp
                  ? 'Creating account...'
                  : 'Signing in...'
                : isSignUp
                ? 'Sign Up'
                : 'Sign In'}
            </Button>
          </form>
          <p className="mt-4 text-white/60 text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-400 hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </GlassCard>
      </div>
    </div>
  )
}