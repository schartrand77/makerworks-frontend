// src/components/AuthForm.jsx
import { useRef, useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import AuthInput from './AuthInput'

export default function AuthForm({ isLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const emailRef = useRef(null)

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus()
    setEmail('')
    setPassword('')
    setError('')
  }, [isLogin])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)
    setError('')
    const auth = useAuthStore.getState()

    try {
      if (isLogin) {
        await auth.signin(email, password)
      } else {
        await auth.signup(email, password)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" role="form">
      <AuthInput
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        inputRef={emailRef}
      />
      <AuthInput
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      <button
        disabled={loading}
        type="submit"
        className="bg-white/20 text-white font-medium py-3 rounded-xl hover:bg-white/30 transition disabled:opacity-40"
      >
        {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  )
}