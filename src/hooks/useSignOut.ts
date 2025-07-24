import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import axiosInstance from '@/api/axios';

/**
 * Handles sign-out:
 * - Calls backend `/auth/signout` to clear Redis session.
 * - Clears local auth store.
 * - Redirects to `/` (landing page).
 * - Disables button while signing out.
 */
export const useSignOut = () => {
  const [disabled, setDisabled] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const signOut = async () => {
    if (disabled) {
      console.warn('[useSignOut] Already in progress — ignored.');
      return;
    }

    setDisabled(true);
    console.info('[useSignOut] 🔒 Signing out…');

    try {
      await axiosInstance.post('/auth/signout').catch((err) => {
        console.warn(
          '[useSignOut] Backend sign-out failed (continuing anyway):',
          err
        );
      });

      logout();

      console.info('[useSignOut] ✅ Local session cleared.');
    } catch (err) {
      console.error('[useSignOut] Unexpected error during sign-out:', err);
    } finally {
      setDisabled(false);
      navigate('/'); // Always redirect to landing page
    }
  };

  return {
    disabled,
    signOut,
  };
};
