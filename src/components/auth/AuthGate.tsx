import { Navigate } from "react-router-dom"
import { useUser } from "@/hooks/useUser"
import { ReactNode, useEffect } from "react"

type AuthGateProps = {
  children: ReactNode
  role?: string | null
}

export default function AuthGate({
  children,
  role = null,
}: AuthGateProps): JSX.Element | null {
  const { user, loading } = useUser()

  useEffect(() => {
    console.debug("[AuthGate] User:", user)
    console.debug("[AuthGate] Required Role:", role)
  }, [user, role])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-medium text-muted-foreground animate-pulse">
          Checking your access…
        </div>
      </div>
    )
  }

  if (!user) {
    console.warn("[AuthGate] No user found. Redirecting to /auth/signin")
    return <Navigate to="/auth/signin" replace />
  }

  if (
    role &&
    (!Array.isArray(user.groups) || !user.groups.includes(role))
  ) {
    console.warn(
      `[AuthGate] User lacks required group "${role}". Redirecting to /unauthorized`
    )
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}