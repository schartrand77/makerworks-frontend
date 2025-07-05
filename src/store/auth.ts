import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getCurrentUser } from '@/api/auth'
import type { User } from '@/types/user'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  resolved: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
  fetchUser: () => Promise<void>
  isAuthenticated: () => boolean
  hasRole: (role: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      resolved: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
      fetchUser: async () => {
        const { token, resolved } = get()
        if (resolved) return
        if (!token) {
          set({ resolved: true })
          return
        }
        set({ loading: true })
        try {
          const user = await getCurrentUser()
          set({ user, resolved: true })
        } catch (err) {
          console.error('[AuthStore] fetchUser failed:', err)
          set({ user: null, token: null, resolved: true })
        } finally {
          set({ loading: false })
        }
      },
      isAuthenticated: () => Boolean(get().token && get().user),
      hasRole: (role: string) => get().user?.groups?.includes(role) ?? false,
    }),
    { name: 'auth-storage' }
  )
)
