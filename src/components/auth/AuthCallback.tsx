// src/components/auth/AuthCallback.tsx

import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import PageLayout from "@/components/layout/PageLayout"
import { useAuthStore } from "@/store/useAuthStore"
import axios from "@/api/axios"

const AuthCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const code = searchParams.get("code")

  useEffect(() => {
    const finishAuth = async () => {
      if (!code) {
        console.error("[AuthCallback] No code in query string.")
        return navigate("/auth/signin")
      }

      console.debug("[AuthCallback] Handling code:", code)

      try {
        const res = await axios.post("/auth/token", { code })

        if (res.status === 200 && res.data?.token && res.data?.user) {
          const { token, user } = res.data
          useAuthStore.getState().setToken(token)
          useAuthStore.getState().setUser(user)
          localStorage.setItem("auth_token", token)

          console.info("[AuthCallback] ✅ Auth success. Redirecting to dashboard...")
          return navigate("/dashboard")
        }

        throw new Error("Invalid response from /auth/token")
      } catch (err) {
        console.error("[AuthCallback] Auth callback failed:", err)
        useAuthStore.getState().logout()
        navigate("/auth/signin")
      }
    }

    finishAuth()
  }, [code, navigate])

  return (
    <PageLayout title="Signing you in...">
      <div className="glass-card p-8 text-center">
        <h1 className="text-xl font-semibold mb-4">Finishing login…</h1>
        <p className="text-muted-foreground">Please wait while we sign you in with Authentik.</p>
      </div>
    </PageLayout>
  )
}

export default AuthCallback
