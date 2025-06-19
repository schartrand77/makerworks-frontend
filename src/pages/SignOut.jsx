import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export default function SignOut() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    logout()
    navigate('/auth/signin', { replace: true })
  }, [logout, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <p>Signing you out...</p>
    </div>
  )
}