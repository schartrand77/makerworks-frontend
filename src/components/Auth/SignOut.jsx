// src/components/Auth/SignOut.jsx
import { useEffect } from 'react'
import { clearToken } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function SignOut() {
  const navigate = useNavigate()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  useEffect(() => {
    clearToken()
    clearAuth()
    navigate('/signin')
  }, [])

  return null
}