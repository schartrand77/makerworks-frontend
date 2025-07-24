import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import axiosInstance from '@/api/axios';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserOut } from '@/types/auth';

interface SigninResponse {
  user: UserOut;
  token?: string;
}

export const useSignIn = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  const signIn = async (emailOrUsername: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      console.debug('[useSignIn] Attempting login with:', { emailOrUsername });

      const res = await axiosInstance.post<SigninResponse>('/auth/signin', {
        email_or_username: emailOrUsername,
        password,
      });

      const { user, token } = res.data;

      if (!user) {
        throw new Error('Invalid response: missing user');
      }

      console.info('[useSignIn] Login successful:', { user });

      // Derive avatar path and store it
      const avatarPath = `/avatars/${user.id}.png`;
      localStorage.setItem('avatar_url', avatarPath);

      // Update user store with avatar_url injected
      setUser({ ...user, avatar_url: avatarPath });
      if (token) setToken(token);

      navigate('/dashboard');
    } catch (err) {
      console.error('[useSignIn] Login failed:', err);

      let message = 'Sign in failed. Please try again.';

      if (isAxiosError(err)) {
        const detail = err.response?.data?.detail;

        if (Array.isArray(detail)) {
          message = detail
            .map((e: { loc?: string[]; msg?: string }) =>
              e.loc && e.msg ? `${e.loc.join('.')}: ${e.msg}` : ''
            )
            .filter(Boolean)
            .join('; ');
        } else if (typeof detail === 'string') {
          message = detail;
        } else if (err.response?.status) {
          message = `Error ${err.response.status}: ${err.response.statusText}`;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { signIn, error, loading };
};
