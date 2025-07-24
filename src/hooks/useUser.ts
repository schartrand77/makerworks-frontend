import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

export interface Upload {
  id: string;
  name: string;
  created_at: string;
  // size?: number;
  // url?: string;
}

export const useUser = () => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const resolved = useAuthStore((s) => s.resolved);
  const isAuthenticatedFn = useAuthStore((s) => s.isAuthenticated);
  const hasRoleFn = useAuthStore((s) => s.hasRole);
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const setUser = useAuthStore((s) => s.setUser);
  const setResolved = useAuthStore((s) => s.setResolved);
  const logout = useAuthStore((s) => s.logout);

  const [error, setError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(
    localStorage.getItem('avatar_url')
  );

  const hydrate = async () => {
    if (loading) return;

    console.debug('[useUser] Hydrating user from backend…');

    try {
      const u = await fetchUser?.();

      if (!u) {
        throw new Error('No user returned from backend.');
      }

      if (u.avatar_url) {
        localStorage.setItem('avatar_url', u.avatar_url);
        setAvatar(u.avatar_url);
      } else {
        localStorage.removeItem('avatar_url');
        setAvatar(null);
      }

      // fetch uploads if user exists & has ID
      if (u.id) {
        try {
          const uploadsRes = await axios.get(`/api/v1/users/${u.id}/uploads`);
          const uploads: Upload[] = uploadsRes.data?.models ?? [];
          u.uploads = uploads.sort(
            (a, b) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          console.debug('[useUser] fetched uploads:', u.uploads);
        } catch (uploadsErr) {
          console.warn('[useUser] failed to fetch uploads:', uploadsErr);
          u.uploads = [];
        }
      }

      setUser?.(u);

      if (!resolved) {
        setResolved?.(true);
      }
    } catch (err: any) {
      console.warn('[useUser] fetchUser() failed:', err);
      setError(err?.message || 'Failed to fetch user');
    }
  };

  useEffect(() => {
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = () => {
    logout?.();
    localStorage.removeItem('avatar_url');
    setAvatar(null);
  };

  const isAdmin = hasRoleFn?.('admin') ?? false;
  const isUser = hasRoleFn?.('user') ?? false;

  const getRecentUploads = (count = 5): Upload[] => {
    return (user?.uploads ?? []).slice(0, count);
  };

  return {
    user,
    userId: user?.id,
    roles: user?.groups ?? [],
    loading,
    resolved,
    isAuthenticated: isAuthenticatedFn?.() ?? false,
    isAdmin,
    isUser,
    error,
    refresh: hydrate,
    setUser,
    signOut: handleSignOut,
    avatar, // updated avatar (from localStorage if present)
    getRecentUploads,
  };
};
