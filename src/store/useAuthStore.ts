// src/store/useAuthStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '@/api/axios';

interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string | null;
  groups?: string[] | null;
  role?: string | null;
  bio?: string | null;
  created_at?: string;
  last_login?: string | null;
  is_verified?: boolean;
  is_active?: boolean;
  language?: string;
  theme?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  resolved: boolean;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearUser: () => void;

  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  refreshToken: () => Promise<void>;

  isAuthenticated: () => boolean;
  hasRole: (role: 'admin' | 'user') => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: (typeof window !== 'undefined' && localStorage.getItem('token')) || null,
      loading: false,
      resolved: false,

      setUser: (user) => {
        console.debug('[AuthStore] setUser:', user);
        set({ user, resolved: true });
      },

      setToken: (token) => {
        console.debug('[AuthStore] setToken:', token);
        if (typeof window !== 'undefined') {
          if (token) {
            localStorage.setItem('token', token);
          } else {
            localStorage.removeItem('token');
          }
        }
        set({ token });
      },

      clearUser: () => {
        console.debug('[AuthStore] clearUser()');
        set({ user: null, token: null, resolved: true });
      },

      logout: async () => {
        console.debug('[AuthStore] logout()');
        try {
          await axios.post('/auth/logout', {}, { withCredentials: true });
        } catch (err) {
          console.warn('[AuthStore] logout request failed (proceeding anyway):', err);
        }
        set({ user: null, token: null, resolved: true });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      },

      isAuthenticated: () => {
        const state = get();
        const authenticated = !!state.user?.id && !!state.token;
        console.debug('[AuthStore] isAuthenticated:', authenticated);
        return authenticated;
      },

      hasRole: (role) => {
        const state = get();
        const groups = state.user?.groups ?? [];
        const normalized = `MakerWorks-${role.charAt(0).toUpperCase() + role.slice(1)}`;
        const inGroups = groups.includes(normalized);
        const roleMatch = state.user?.role === role;

        const has = inGroups || roleMatch;
        console.debug(`[AuthStore] Checking role '${role}':`, has, {
          groups,
          roleField: state.user?.role,
        });
        return has;
      },

      fetchUser: async () => {
        console.debug('[AuthStore] fetchUser()');
        set({ loading: true });
        try {
          const res = await axios.get('/auth/me', { withCredentials: true });
          set({ user: res.data, resolved: true });
          console.debug('[AuthStore] ✅ fetchUser success:', res.data);
        } catch (err) {
          console.warn('[AuthStore] ⚠️ fetchUser failed:', err);
          set({ user: null, resolved: true });
        } finally {
          set({ loading: false });
        }
      },

      refreshToken: async () => {
        console.debug('[AuthStore] refreshToken()');
        try {
          const res = await axios.post('/auth/refresh', {}, { withCredentials: true });
          const { token } = res.data;
          if (token) {
            get().setToken(token);
            console.debug('[AuthStore] 🔄 Token refreshed');
          }
        } catch (err) {
          console.warn('[AuthStore] Failed to refresh token:', err);
          get().logout();
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        resolved: state.resolved,
      }),
    }
  )
);

// 🌐 Sync token and user across browser tabs
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'token') {
      console.debug('[AuthStore] Synced token from storage:', event.newValue);
      useAuthStore.setState({ token: event.newValue });
    }

    if (event.key === 'auth-store') {
      try {
        const data = event.newValue ? JSON.parse(event.newValue) : null;
        console.debug('[AuthStore] Synced user from storage:', data?.state?.user);
        useAuthStore.setState({ user: data?.state?.user ?? null });
      } catch (err) {
        console.error('[AuthStore] Failed to sync state from storage:', err);
      }
    }
  });
}