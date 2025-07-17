import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '@/api/axios';

interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setToken: (token) => {
        set({ token });
      },
      setUser: (user) => {
        set({ user });
      },
      logout: () => {
        set({ token: null, user: null });
        localStorage.removeItem('token');
      },
      fetchUser: async () => {
        try {
          const res = await axios.get('/auth/me');
          set({ user: res.data });
        } catch (err) {
          console.error('Failed to fetch user:', err);
          get().logout();
        }
      },
      isAuthenticated: () => !!get().user,
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
