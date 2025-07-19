import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axios';

type SignOutButtonProps = {
  className?: string;
  redirectTo?: string; // optionally specify where to send user after logout
};

/**
 * Logs the user out locally & optionally calls backend to revoke session.
 */
export default function SignOutButton({
  className = '',
  redirectTo = '/',
}: SignOutButtonProps) {
  const [loading, setLoading] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setLoading(true);

    try {
      // Optionally notify backend
      await axiosInstance.post('/auth/signout').catch((err) => {
        console.warn('[SignOutButton] Backend signout failed, ignoring', err);
      });

      logout();

      navigate(redirectTo);
    } catch (err) {
      console.error('[SignOutButton] Signout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={`px-4 py-2 text-sm rounded-xl bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition text-zinc-800 dark:text-white disabled:opacity-50 ${className}`}
      aria-busy={loading}
    >
      {loading ? 'Signing out…' : 'Sign Out'}
    </button>
  );
}
