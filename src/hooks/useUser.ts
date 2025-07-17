// src/hooks/useUser.ts
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export const useUser = () => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const resolved = useAuthStore((s) => s.resolved);
  const isAuthenticatedFn = useAuthStore((s) => s.isAuthenticated);
  const hasRoleFn = useAuthStore((s) => s.hasRole);
  const fetchUser = useAuthStore((s) => s.fetchUser);

  const [error, setError] = useState<string | null>(null);

  const hydrate = () => {
    if (!resolved && !loading) {
      console.debug('[useUser] Hydrating user via fetchUser()...');
      fetchUser?.().catch((err) => {
        console.warn('[useUser] fetchUser() failed:', err);
        setError(err?.message || 'Failed to fetch user');
      });
    }
  };

  useEffect(() => {
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolved, loading]);

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
  };
};
