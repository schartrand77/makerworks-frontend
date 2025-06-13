// src/components/Auth/RequireAuth.jsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function RequireAuth({ children }) {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()
  

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  return children
}