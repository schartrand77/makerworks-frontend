import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axios';

type UseSignOutResult = {
  disabled: boolean;
  signOut: () => void;
};

/**
 * Handles sign-out:
 * - Optional backend `/auth/signout` call.
 * - Clears local store.
 * - Redirects to `/` (or wherever `navigate` is used after signOut).
 * - Disables button during process.
 */
export const useSignOut = (): UseSignOutResult => {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);

  const signOut = async () => {
    if (disabled) {
      console.warn('[useSignOut] Already signing out — ignored.');
      return;
    }

    setDisabled(true);
    console.info('[useSignOut] 🔒 Signing out…');

    try {
      // optionally call backend
      await axiosInstance.post('/auth/signout').catch((err) => {
        console.warn('[useSignOut] Backend signout failed (continuing anyway):', err);
      });

      logout();

      console.info('[useSignOut] ✅ Local session cleared.');

      navigate('/'); // optional: adjust as needed
    } catch (err) {
      console.error('[useSignOut] Sign-out error:', err);
    } finally {
      setDisabled(false);
    }
  };

  return {
    disabled,
    signOut,
  };
};
