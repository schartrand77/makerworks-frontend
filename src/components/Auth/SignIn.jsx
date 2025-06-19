import React, { useState, useEffect } from 'react'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { useNavigate } from 'react-router-dom'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { signin, loading, error, user, authLoaded } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (authLoaded && user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    }
  }, [user, authLoaded, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signin(email, password)
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
          <h1 className="text-3xl font-semibold mb-4 text-white">Sign In</h1>
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="w-full p-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full p-3 pr-12 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white/60 hover:text-white/90 focus:outline-none"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <Button
              type="submit"
              size="lg"
              variant="solid"
              theme="auto"
              disabled={loading}
              className="w-full hover:scale-105 active:scale-95 transition-transform"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}
          </form>
        </GlassCard>
      </div>
    </div>
  )
}