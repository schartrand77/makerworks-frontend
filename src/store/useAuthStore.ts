// src/store/useAuthStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from '@/api/axios'

interface User {
  id: string
  email: string
  username: string
  avatar?: string
  groups?: string[]
}

interface AuthState {
  user: User | null
  loading: boolean
  resolved: boolean
  setUser: (user: User | null) => void
  clearUser: () => void
  logout: () => void
  fetchUser: () => Promise<void>
  isAuthenticated: () => boolean
  hasRole: (role: 'admin' | 'user') => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      resolved: false,

      setUser: (user) => {
        console.debug('[AuthStore] setUser:', user)
        set({ user, resolved: true })
      },

      clearUser: () => {
        console.debug('[AuthStore] clearUser()')
        set({ user: null, resolved: true })
      },

      logout: () => {
        console.debug('[AuthStore] logout()')
        set({ user: null, resolved: true })
        // optionally you can also trigger backend logout endpoint here
        // await axios.post('/auth/logout', {}, { withCredentials: true })
      },

      isAuthenticated: () => {
        const state = get()
        return !!state.user?.id
      },

      hasRole: (role) => {
        const state = get()
        const groups = state.user?.groups ?? []
        return groups.includes(`MakerWorks-${role.charAt(0).toUpperCase() + role.slice(1)}`)
      },

      fetchUser: async () => {
        set({ loading: true })

        try {
          const res = await axios.get('/auth/me', { withCredentials: true })
          set({ user: res.data, resolved: true })
          console.debug('[AuthStore] ✅ fetchUser success:', res.data)
        } catch (err) {
          console.warn('[AuthStore] ⚠️ fetchUser failed:', err)
          set({ user: null, resolved: true })
        } finally {
          set({ loading: false })
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
)