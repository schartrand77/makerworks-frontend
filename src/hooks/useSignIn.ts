// src/hooks/useSignIn.ts
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from '@/api/axios'
import { useAuthStore } from '@/store/useAuthStore'

export const useSignIn = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const signIn = async (emailOrUsername: string, password: string) => {
    setLoading(true)

    try {
      const res = await axios.post('/auth/signin', {
        email_or_username: emailOrUsername,
        password
      })

      const { token, user } = res.data
      if (!token || !user) throw new Error('Invalid response from server')

      // 🔧 Set Zustand store + localStorage in one call
      useAuthStore.getState().setAuth({ token, user })

      toast.success(`Welcome back, ${user.username}!`)
      navigate('/dashboard')
    } catch (err: any) {
      console.error('[useSignIn] Login failed:', err)
      toast.error('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return { signIn, loading }
}
