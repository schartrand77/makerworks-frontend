import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '@/api/axios'
import { useAuthStore } from '@/store/useAuthStore'

interface UseSignInResult {
  emailOrUsername: string
  setEmailOrUsername: (v: string) => void
  password: string
  setPassword: (v: string) => void
  error: string | null
  loading: boolean
  handleSubmit: (e: React.FormEvent) => void
}

export const useSignIn = (): UseSignInResult => {
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const setUser = useAuthStore((s) => s.setUser)
  const setToken = useAuthStore((s) => s.setToken)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.debug('[useSignIn] Payload:', { emailOrUsername })

      const res = await axios.post('/auth/signin', {
        email_or_username: emailOrUsername,
        password,
      })

      const { user, token } = res.data

      if (!user || !token) {
        throw new Error('Invalid response format')
      }

      if (typeof setToken === 'function') {
        setToken(token)
      }

      localStorage.setItem('token', token)
      setUser(user)

      console.debug('[useSignIn] User authed:', user)
      navigate('/dashboard')
    } catch (err: any) {
      console.error('[useSignIn] Sign in error', err)

      const detail = err?.response?.data?.detail
      if (Array.isArray(detail)) {
        const messages = detail.map(
          (e: any) => `${e.loc?.join('.')}: ${e.msg}`
        )
        setError(messages.join('; '))
      } else if (typeof detail === 'string') {
        setError(detail)
      } else {
        setError('Sign in failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    emailOrUsername,
    setEmailOrUsername,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  }
}
