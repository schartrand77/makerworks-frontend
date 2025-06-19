import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'

export default function RequireAuth({ children }) {
  const { user, authLoaded } = useAuthStore()

  if (!authLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace />
  }

  return children
}