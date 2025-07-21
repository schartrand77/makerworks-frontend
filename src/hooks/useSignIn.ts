import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { isAxiosError } from 'axios';
import axiosInstance from '@/api/axios';
import { useAuthStore } from '@/store/useAuthStore';
import type { SigninResponse, UserOut } from '@/types/auth';

export const useSignIn = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const signIn = async (emailOrUsername: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      console.debug('[useSignIn] Attempting login with:', {
        email_or_username: emailOrUsername,
      });

      const res = await axiosInstance.post<SigninResponse>('/auth/signin', {
        email_or_username: emailOrUsername,
        password,
      });

      const { user, token } = res.data;

      if (!user || !token) {
        throw new Error('Invalid response: missing user or token');
      }

      console.info('[useSignIn] Login successful:', { user, token });

      // Store avatar path locally (optional, based on your app logic)
      const avatarPath = `/avatars/${user.id}.png`;
      localStorage.setItem('avatar_url', avatarPath);

      const userWithAvatar: UserOut = {
        ...user,
        avatar_url: avatarPath,
      };

      setToken(token);
      setUser(userWithAvatar);

      navigate('/dashboard');
    } catch (err) {
      console.error('[useSignIn] Login failed:', err);

      let message = 'Sign in failed. Please try again.';

      if (isAxiosError(err)) {
        const detail = err.response?.data?.detail;

        if (Array.isArray(detail)) {
          // detail might be a list of validation errors
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
