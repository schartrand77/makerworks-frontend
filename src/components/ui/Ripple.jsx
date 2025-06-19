// src/pages/SignIn.jsx

import React, { useState } from 'react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import { useAuthStore } from '../store/useAuthStore'

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signin, loading, error } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signin(email, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-200/50 to-white/30 dark:from-zinc-900/40 dark:to-black/20 p-4">
      <GlassCard className="w-full max-w-md p-8 space-y-6">
        <h1 className="text-3xl font-semibold text-center text-zinc-800 dark:text-white">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-semibold"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </form>
      </GlassCard>
    </div>
  )
}

export default SignIn