// src/components/auth/AuthCallback.tsx

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import PageLayout from "@/components/layout/PageLayout"
import { useAuthStore } from "@/store/useAuthStore"
import axios from "@/api/axios"

const AuthCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const code = searchParams.get("code")

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const finishAuth = async () => {
      if (!code) {
        console.error("[AuthCallback] No code in query string.")
        navigate("/auth/signin")
        return
      }

      console.debug("[AuthCallback] Handling code:", code)

      try {
        const res = await axios.post("/auth/token", { code })

        if (res.status === 200 && res.data?.token && res.data?.user) {
          const { token, user } = res.data

          useAuthStore.getState().setToken(token)
          useAuthStore.getState().setUser(user)
          localStorage.setItem("token", token)

          console.info("[AuthCallback] ✅ Auth success. Redirecting to dashboard…")
          navigate("/dashboard")
          return
        }

        throw new Error("Invalid response from /auth/token")
      } catch (err: any) {
        console.error("[AuthCallback] Auth callback failed:", err)
        useAuthStore.getState().logout()
        localStorage.removeItem("token")
        setError("Authentication failed. Please try signing in again.")
        setTimeout(() => navigate("/auth/signin"), 3000)
      }
    }

    finishAuth()
  }, [code, navigate])

  return (
    <PageLayout title="Signing you in…">
      <div className="glass-card p-8 text-center">
        <h1 className="text-xl font-semibold mb-4">
          {error ? "Authentication Failed" : "Finishing login…"}
        </h1>
        <p className="text-muted-foreground">
          {error || "Please wait while we sign you in with Authentik."}
        </p>
      </div>
    </PageLayout>
  )
}

export default AuthCallback
