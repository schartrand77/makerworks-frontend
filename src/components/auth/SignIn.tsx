import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import { useAuthStore } from '@/store/useAuthStore'
import { signup } from '@/api/auth'

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const setUser = useAuthStore((s) => s.setUser)
  const setToken = useAuthStore((s) => s.setToken)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.debug('[SignUp] Payload:', { email, username })

      const res = await signup({ email, username, password })

      if (!res.ok) {
        const text = await res.text()
        console.warn('[SignUp] Non-OK response:', res.status, text)
        throw new Error(`Signup failed with ${res.status}`)
      }

      const data = await res.json().catch((err) => {
        throw new Error('[SignUp] Invalid JSON response: ' + err.message)
      })

      console.debug('[SignUp] Parsed JSON:', data)

      if (!data?.token || !data?.user) {
        console.error('[SignUp] Invalid response format:', data)
        throw new Error('Invalid response format')
      }

      if (typeof setToken === 'function') {
        setToken(data.token)
      } else {
        console.warn('[SignUp] ⚠️ setToken is not a function')
      }

      localStorage.setItem('token', data.token)
      setUser(data.user)

      console.debug('[SignUp] User created and authed:', data.user)
      navigate('/dashboard')
    } catch (err: any) {
      console.error('[SignUp] Signup error', err)
      setError(err.message || 'An error occurred during sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="Sign Up">
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white/70 dark:bg-zinc-900/60 shadow-xl rounded-xl px-6 py-8 w-full max-w-sm backdrop-blur-md border border-zinc-200 dark:border-zinc-800"
        >
          <h1 className="text-2xl font-semibold mb-4 text-center">Sign Up</h1>

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 px-4 py-2 rounded-md border dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Username"
            className="w-full mb-3 px-4 py-2 rounded-md border dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-2 rounded-md border dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-zinc-900 dark:bg-white dark:text-black text-white py-2 rounded-md font-medium hover:opacity-90 transition"
            disabled={loading}
          >
            {loading ? 'Signing up…' : 'Sign Up'}
          </button>
        </form>
      </div>
    </PageLayout>
  )
}

export default SignUp