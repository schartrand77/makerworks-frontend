// src/api/authCallback.ts
import axios from "@/api/axios"
import { useAuthStore } from "@/store/useAuthStore"
import { NavigateFunction } from "react-router-dom"

export async function handleAuthCallback(
  code: string,
  navigate: NavigateFunction
): Promise<void> {
  console.debug("[AuthCallback] Received code:", code)

  try {
    const res = await axios.post("/auth/token", { code })
    console.debug("[AuthCallback] Token exchange response:", res)

    if (res.status === 200 && res.data?.token && res.data?.user) {
      useAuthStore.getState().setToken(res.data.token)
      useAuthStore.getState().setUser(res.data.user, res.data.token)

      localStorage.setItem("auth_token", res.data.token)
      console.debug("[AuthCallback] ✅ Token saved and user updated")

      navigate("/dashboard")
    } else {
      console.error("[AuthCallback] ⚠️ Invalid response from /auth/token:", res)
    }
  } catch (err: any) {
    console.error("[AuthCallback] ❌ Failed to exchange code:", err)
    useAuthStore.getState().logout()
  }
}
