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
  const logout = useAuthStore((s) => s.logout);

  const [error, setError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(
    localStorage.getItem('avatar_url')
  );

  const hydrate = async () => {
    if (loading) return;

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

      if (!resolved) {
        setResolved?.(true);
      }
    } catch (err: any) {
      console.warn('[useUser] fetchUser() failed:', err);
      setError(err?.message || 'Failed to fetch user');
    }
  };

  // always refresh user on mount to get latest avatar & roles
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
    avatar, // ✅ cached avatar, updated on hydrate()
  };
};
