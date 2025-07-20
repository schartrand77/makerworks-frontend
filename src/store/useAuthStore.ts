import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '@/api/axios';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  role: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  loading: boolean;
  resolved: boolean;

  setToken: (token: string, refreshToken: string) => void;
  setUser: (user: User | null) => void;
  setResolved: (val: boolean) => void;
  logout: () => void;
  fetchUser: () => Promise<User | null>;
  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      loading: false,
      resolved: false,

      /**
       * Sets both access and refresh tokens
       */
      setToken: (token: string, refreshToken: string) => {
        set({ token, refreshToken });
      },

      /**
       * Sets the current user object
       */
      setUser: (user: User | null) => {
        set({ user });
      },

      /**
       * Marks hydration resolved
       */
      setResolved: (val: boolean) => {
        set({ resolved: val });
      },

      /**
       * Logs out fully: clears tokens & user state
       */
      logout: () => {
        set({ token: null, refreshToken: null, user: null, loading: false, resolved: false });
        toast.info('You have been signed out.');
      },

      /**
       * Fetches /auth/me and updates user
       */
      fetchUser: async () => {
        set({ loading: true });
        try {
          const res = await axios.get('/auth/me');
          console.debug('[useAuthStore] fetched user:', res.data);
          set({ user: res.data, loading: false, resolved: true });
          return res.data;
        } catch (err) {
          console.error('[useAuthStore] Failed to fetch user', err);
          get().logout();
          set({ loading: false, resolved: true });
          return null;
        }
      },

      /**
       * Checks if a valid token and user exist
       */
      isAuthenticated: () => {
        const state = get();
        return !!state.token && !!state.user && state.user.role !== 'guest';
      },

      /**
       * Checks if user has specific role
       */
      hasRole: (role: string) => {
        const state = get();
        return state.user?.role === role;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);
