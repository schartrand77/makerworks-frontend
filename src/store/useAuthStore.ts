// src/store/useAuthStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '@/api/axios';
import { toast } from 'sonner';
import type { UserOut } from '@/types/auth';

interface AuthState {
  user: UserOut | null;
  token: string | null;
  loading: boolean;
  resolved: boolean;

  setUser: (user: UserOut | null) => void;
  setToken: (token: string | null) => void;
  setResolved: (val: boolean) => void;
  logout: () => Promise<void>;
  fetchUser: (force?: boolean) => Promise<UserOut | null>;
  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      resolved: false,

      setUser: (user) => {
        console.debug('[useAuthStore] setUser called with:', user);
        set({ user });
      },

      setToken: (token) => {
        console.debug('[useAuthStore] setToken called with:', token);
        set({ token });
      },

      setResolved: (val) => {
        console.debug('[useAuthStore] setResolved:', val);
        set({ resolved: val });
      },

      logout: async () => {
        set({ loading: true });
        try {
          await axios.post('/auth/signout');
          toast.info('👋 Signed out successfully.');
        } catch (err) {
          console.error('[useAuthStore] signout error:', err);
          toast.warning('⚠️ Could not fully sign out on server.');
        } finally {
          set({ user: null, token: null, loading: false, resolved: false }, true);

          try {
            localStorage.removeItem('avatar_url');
            localStorage.removeItem('auth-storage');
            sessionStorage.removeItem('auth-storage');
          } catch (err) {
            console.warn('[useAuthStore] Failed to clear local/session storage:', err);
          }
        }
      },

      fetchUser: async (force = false) => {
        if (!force && get().resolved) {
          console.debug('[useAuthStore] fetchUser skipped: already resolved');
          return get().user;
        }

        set({ loading: true });
        try {
          const res = await axios.get<UserOut>('/auth/me');
          console.debug('[useAuthStore] fetched user:', res.data);

          set({ user: res.data, loading: false, resolved: true });
          return res.data;
        } catch (err: any) {
          console.error('[useAuthStore] Failed to fetch user:', err);

          if (err?.response?.status === 401) {
            toast.info('🔒 Session expired — please sign in.');
          } else {
            toast.error('⚠️ Failed to fetch user.');
          }

          await get().logout();
          set({ loading: false, resolved: true });
          return null;
        }
      },

      isAuthenticated: () => {
        const u = get().user;
        const auth = !!u;
        console.debug('[useAuthStore] isAuthenticated:', auth);
        return auth;
      },

      hasRole: (role: string) => {
        const user = get().user;
        if (!user) {
          console.warn('[useAuthStore] hasRole called but no authenticated user');
          return false;
        }

        const target = role.toLowerCase();

        if (Array.isArray(user.role)) {
          return user.role.some((r) => r.toLowerCase() === target);
        }

        return user.role?.toLowerCase() === target;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user ?? null,
        token: state.token ?? null,
      }),
      onRehydrateStorage: () => () => {
        console.info('[useAuthStore] State rehydrated from storage');
      },
    }
  )
);
