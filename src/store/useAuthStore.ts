import { create } from 'zustand'
import axios from '@/api/axios'
import type { User } from '@/types/user'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  resolved: boolean
  godMode: boolean
  setGodMode: (enabled: boolean) => void
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  clearUser: () => void
  logout: () => void
  fetchUser: () => Promise<void>
  isAuthenticated: () => boolean
  hasRole: (role: 'admin' | 'user') => boolean
  __mockUser?: boolean
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  loading: false,
  resolved: false,
  godMode: false,
  __mockUser: import.meta.env.MODE === 'development',

  setGodMode: (enabled) => {
    console.debug(`[AuthStore] God mode set to: ${enabled}`)
    set({ godMode: enabled })
  },

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
    set({ user: null, token: null, resolved: true, godMode: false })
    delete axios.defaults.headers.common['Authorization']
  },

  isAuthenticated: () => {
    const state = get()
    return !!state.user?.id || !!state.__mockUser || state.godMode
  },

  hasRole: (role) => {
    const state = get()
    if (state.__mockUser || state.godMode) {
      console.debug(`[AuthStore] hasRole("${role}") → true (mock/god mode)`)
      return true
    }

    const groups = state.user?.groups ?? []
    const target = `MakerWorks-${role.charAt(0).toUpperCase() + role.slice(1)}`
    const has = groups.includes(target)
    console.debug(`[AuthStore] hasRole("${role}") → ${has}`)
    return has
  },

  fetchUser: async () => {
    const token = get().token
    const isMock = get().__mockUser

    if (isMock) {
      const mock: User = {
        id: 'mockdev',
        email: 'mockdev@example.com',
        username: 'mockdev',
        groups: ['MakerWorks-Admin', 'MakerWorks-User'],
        avatar: 'https://api.dicebear.com/6.x/shapes/svg?seed=dev',
      }
      console.debug('[AuthStore] ⚙️ Dev mode: injecting mock admin user:', mock)
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
}))