// src/store/useAuthStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from '@/api/axios'
import type { User } from '@/types/user'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  resolved: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  clearUser: () => void
  logout: () => void
  fetchUser: () => Promise<void>
  isAuthenticated: () => boolean
  hasRole: (role: 'admin' | 'user') => boolean
  __mockUser?: boolean // DEV ONLY
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      resolved: false,
      __mockUser: import.meta.env.MODE === 'development', // Enable mock user only in dev

      setUser: (user) => {
        console.debug('[AuthStore] setUser:', user)
        set({ user, resolved: true })
      },

      setToken: (token) => {
        console.debug('[AuthStore] setToken:', token)
        set({ token })

        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } else {
          delete axios.defaults.headers.common['Authorization']
        }
      },

      clearUser: () => {
        console.debug('[AuthStore] clearUser()')
        set({ user: null, token: null, resolved: true })
        delete axios.defaults.headers.common['Authorization']
      },

      logout: () => {
        console.debug('[AuthStore] logout()')
        set({ user: null, token: null, resolved: true })
        delete axios.defaults.headers.common['Authorization']
      },

      isAuthenticated: () => {
        const state = get()
        return !!state.user?.id || !!state.__mockUser
      },

      hasRole: (role) => {
        const state = get()

        if (state.__mockUser) return true

        const groups = state.user?.groups ?? []
        return groups.includes(`MakerWorks-${role.charAt(0).toUpperCase() + role.slice(1)}`)
      },

      fetchUser: async () => {
        const token = get().token
        const isMock = get().__mockUser

        if (isMock) {
          const mock: User = {
            id: 'mock-user-id',
            email: 'dev@maker.local',
            username: 'mockdev',
            groups: ['MakerWorks-Admin', 'MakerWorks-User'],
            avatar: 'https://api.dicebear.com/6.x/shapes/svg?seed=dev',
          }
          console.debug('[AuthStore] ⚙️ Dev mode: injecting mock user:', mock)
          set({ user: mock, resolved: true, loading: false })
          return
        }

        if (!token) {
          console.warn('[AuthStore] fetchUser aborted — no token set.')
          set({ user: null, resolved: true, loading: false })
          return
        }

        set({ loading: true })

        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const res = await axios.get('/auth/me')
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
        token: state.token,
      }),
    }
  )
)
