// src/components/auth/SignUp.tsx

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PageLayout from "@/components/layout/PageLayout"
import { useAuthStore } from "@/store/useAuthStore"
import axios from "@/api/axios"

const SignUp: React.FC = () => {
  const { setUser, setToken } = useAuthStore()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const res = await axios.post("/auth/signup", {
        email,
        username,
        password,
      })

      console.debug("[SignUp] Response:", res.data)

      const { user, token } = res.data

      if (!user || !token) {
        throw new Error("Invalid response format")
      }

      // Save user and token to global auth store
      setUser(user)
      if (typeof setToken === "function") {
        setToken(token)
      } else {
        console.warn("[SignUp] ⚠️ setToken is not a function")
      }

      // Optional: persist token
      localStorage.setItem("token", token)

      // Navigate to dashboard
      navigate("/dashboard")
    } catch (err: any) {
      console.error("[SignUp] Signup error", err)
      setError(err?.response?.data?.detail || "Signup failed")
    }
  }

  return (
    <PageLayout title="Sign Up">
      <div className="glass-card max-w-md mx-auto p-10 shadow-vision">
        <h1 className="text-2xl font-semibold mb-6 text-center">Create a MakerWorks Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-input"
          />
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="glass-input"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass-input"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-xl bg-white/20 dark:bg-white/10 text-white dark:text-white backdrop-blur-md shadow-vision hover:bg-white/30 hover:dark:bg-white/20 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </PageLayout>
  )
}

export default SignUp
