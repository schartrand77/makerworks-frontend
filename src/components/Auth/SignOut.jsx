// src/components/Auth/SignOut.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

export default function SignOut() {
  const navigate = useNavigate()
  const signOut = useAuthStore((s) => s.signOut)

  useEffect(() => {
    async function logout() {
      await signOut()
      navigate('/signin', { replace: true })
    }
    logout()
  }, [signOut, navigate])

  return null
}