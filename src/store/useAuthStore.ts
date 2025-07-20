import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '@/api/axios';
import { toast } from 'sonner';
import type { UserOut } from '@/types/auth';

type User = UserOut;

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
  fetchUser: (force?: boolean) => Promise<User | null>;
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

      setToken: (token, refreshToken) => {
        set({ token, refreshToken });
      },

      setUser: (user) => {
        set({ user });
        if (user?.avatar_url) {
          localStorage.setItem('avatar_url', user.avatar_url);
        } else {
          localStorage.removeItem('avatar_url');
        }
      },

      setResolved: (val) => {
        set({ resolved: val });
      },

      logout: () => {
        set({ token: null, refreshToken: null, user: null, loading: false, resolved: false });
        localStorage.removeItem('avatar_url');
        toast.info('You have been signed out.');
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

          const avatarUrl =
            res.data.avatar_url ||
            `/uploads/users/${res.data.id}/avatars/avatar.jpg`;

          const userWithAvatar: User = { ...res.data, avatar_url: avatarUrl };

          localStorage.setItem('avatar_url', avatarUrl);
          set({ user: userWithAvatar, loading: false, resolved: true });

          return userWithAvatar;
        } catch (err) {
          console.error('[useAuthStore] Failed to fetch user', err);
          get().logout();
          set({ loading: false, resolved: true });
          return null;
        }
      },

      isAuthenticated: () => {
        const state = get();
        return !!state.token && !!state.user && state.user.role !== 'guest';
      },

      hasRole: (role: string) => {
        const state = get();
        return state.user?.role === role;
      },
    }),
    { name: 'auth-store' }
  )
);
