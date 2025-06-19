// src/components/auth/RequireAdmin.jsx
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

export default function RequireAdmin({ children }) {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  }

  if (!user || !user.is_admin) {
    return <Navigate to="/" replace />
  }

  return children
}