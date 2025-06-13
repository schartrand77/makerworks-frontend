import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function RequireAdmin({ children }) {
  const user = useAuthStore((s) => s.user)

  if (!user?.is_admin) {
    return <Navigate to="/" replace />
  }

  return children
}