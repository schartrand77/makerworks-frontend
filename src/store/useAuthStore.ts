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

  setToken: (token: string, refreshToken: string) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,

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
       * Logs out fully: clears tokens & user state
       */
      logout: () => {
        set({ token: null, refreshToken: null, user: null });
        toast.info('You have been signed out.');
      },

      /**
       * Fetches /auth/me and updates user
       */
      fetchUser: async () => {
        try {
          const res = await axios.get('/auth/me');
          set({ user: res.data.user });
        } catch (err) {
          console.error('[useAuthStore] Failed to fetch user', err);
          get().logout();
        }
      },

      /**
       * Checks if a valid token exists
       */
      isAuthenticated: () => {
        return !!get().token && !!get().user && get().user?.role !== 'guest';
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
