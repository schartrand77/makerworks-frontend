import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default RequireAuth
