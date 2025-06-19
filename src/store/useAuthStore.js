
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'
import api from '@/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      authLoaded: false,
      hasFetchedUser: false,
      refreshInterval: null,

      setUser: (user) => set({ user }),

      setToken: (token) => {
        try {
          localStorage.setItem('token', token)
        } catch {}
        set({ token })
      },

      clearAuth: () => {
        try {
          localStorage.removeItem('token')
        } catch {}

        const { refreshInterval } = get()
        if (refreshInterval) clearInterval(refreshInterval)

        set({
          user: null,
          token: null,
          authLoaded: false,
          hasFetchedUser: false,
          refreshInterval: null,
        })
      },

      signin: async (email, password) => {
        try {
          const res = await api.post('/signin', { email, password })
          set({ user: res.data.user, token: res.data.access_token })
          return true
        } catch (err) {
          set({ error: 'Invalid credentials' })
          return false
        }
      },

      signup: async (payload, navigate) => {
        set({ loading: true, error: null })
        try {
          const res = await api.post('/auth/signup', payload)
          const token = res.data.access_token || res.data.token
          const user = res.data.user

          if (!token || !user) throw new Error('Invalid signup response format')

          get().setToken(token)
          set({ user, authLoaded: true, loading: false, error: null })

          if (navigate) navigate('/dashboard')
        } catch (err) {
          console.error('[auth] signup failed:', err)
          set({ error: 'Signup failed', authLoaded: true, loading: false })
        }
      },

      signOut: async () => {
        try {
          await api.post('/auth/signout')
        } catch (err) {
          console.error('[auth] signOut failed:', err)
        } finally {
          get().clearAuth()
        }
      },

      logout: () => {
        get().clearAuth()
      },

      fetchUser: async () => {
        const { token, hasFetchedUser } = get()
        if (hasFetchedUser) return

        set({ loading: true, hasFetchedUser: true, error: null })

        if (!token) {
          set({ authLoaded: true, loading: false })
          return
        }

        // 🔁 Attempt silent refresh if token is expiring
        try {
          const decoded = jwtDecode(token)
          const now = Date.now() / 1000
          if (decoded.exp && decoded.exp < now + 60) {
            const refresh = await api.post('/auth/refresh')
            const newToken = refresh.data.access_token || refresh.data.token
            get().setToken(newToken)
          }
        } catch (e) {
          console.warn('[auth] token refresh skipped or failed:', e)
        }

        try {
          const res = await api.get('/me')
          set({ user: res.data, authLoaded: true, loading: false })
        } catch (err) {
          console.error('[auth] fetchUser failed:', err)

          if (err?.response?.status === 401) {
            get().clearAuth()
          }

          set({
            error: 'Failed to fetch user',
            authLoaded: true,
            loading: false,
          })
        }
      },

      initTokenRefreshLoop: () => {
        const interval = setInterval(async () => {
          const { token } = get()
          if (!token) return

          try {
            const decoded = jwtDecode(token)
            const now = Date.now() / 1000

            if (decoded.exp && decoded.exp < now + 120) {
              const res = await api.post('/auth/refresh')
              const newToken = res.data.access_token || res.data.token
              get().setToken(newToken)
              console.info('[auth] token refreshed')
            }
          } catch (err) {
            console.warn('[auth] background refresh failed', err)
          }
        }, 5 * 60 * 1000) // every 5 minutes

        set({ refreshInterval: interval })
      },

      isAuthenticated: (role = null) => {
        const { token, user } = get()
        const ok = !!token && !!user
        if (!role) return ok
        return ok && user.role === role
      },

      isAdmin: () => {
        const { user } = get()
        return user?.role === 'admin'
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => () => {
        const { fetchUser, initTokenRefreshLoop } = useAuthStore.getState()
        fetchUser()
        initTokenRefreshLoop()
      },
    }
  )
)
