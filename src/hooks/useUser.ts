import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export const useUser = () => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const resolved = useAuthStore((s) => s.resolved);
  const isAuthenticatedFn = useAuthStore((s) => s.isAuthenticated);
  const hasRoleFn = useAuthStore((s) => s.hasRole);
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const setUser = useAuthStore((s) => s.setUser);
  const setResolved = useAuthStore((s) => s.setResolved);
  const signOut = useAuthStore((s) => s.signOut);

  const [error, setError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(
    localStorage.getItem('avatar_url')
  );

  const hydrate = async () => {
    if (!resolved && !loading) {
      console.debug('[useUser] Hydrating user via fetchUser()...');
      try {
        const u = await fetchUser?.();
        if (u?.avatar_url) {
          localStorage.setItem('avatar_url', u.avatar_url);
          setAvatar(u.avatar_url);
        } else {
          localStorage.removeItem('avatar_url');
          setAvatar(null);
        }
        setResolved?.(true);
      } catch (err) {
        console.warn('[useUser] fetchUser() failed:', err);
        setError(err?.message || 'Failed to fetch user');
      }
    }
  };

  useEffect(() => {
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only run on mount

  const handleSignOut = () => {
    signOut?.();
    localStorage.removeItem('avatar_url');
    setAvatar(null);
  };

  const isAdmin = hasRoleFn?.('admin') ?? false;
  const isUser = hasRoleFn?.('user') ?? false;

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
    avatar, // ✅ expose cached avatar
  };
};
