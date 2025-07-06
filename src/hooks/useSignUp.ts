// src/hooks/useSignUp.ts
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '@/api/axios'
import { useAuthStore } from '@/store/useAuthStore'

export const useSignUp = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const setToken = useAuthStore((s) => s.setToken)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // 🚀 prevent reload
    setLoading(true)
    setError(null)

    try {
      console.debug('[useSignUp] Payload:', { email, username })

      const res = await axios.post('/auth/signup', {
        email,
        username,
        password,
      })

      const { user, token } = res.data

      if (!user || !token) {
        throw new Error('Invalid response format')
      }

      if (typeof setToken === 'function') setToken(token)
      localStorage.setItem('token', token)
      setUser(user)

      console.debug('[useSignUp] User registered:', user)
      navigate('/dashboard')
    } catch (err: any) {
      console.error('[useSignUp] Signup error', err)

      const detail = err?.response?.data?.detail
      if (Array.isArray(detail)) {
        const messages = detail.map(
          (e: any) => `${e.loc?.join('.')}: ${e.msg}`
        )
        setError(messages.join('; '))
      } else if (typeof detail === 'string') {
        setError(detail)
      } else {
        setError('Signup failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  }
}