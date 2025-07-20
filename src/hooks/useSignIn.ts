import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axios'; // ✅ use the configured instance
import { useAuthStore } from '@/store/useAuthStore';
import type { SigninResponse, UserOut } from '@/types/auth';

export const useSignIn = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const signIn = async (emailOrUsername: string, password: string) => {
    setError(null);

    try {
      console.debug('[useSignIn] Sending credentials:', {
        emailOrUsername,
        password: '[hidden]',
      });

      console.debug(
        '[useSignIn] Full URL:',
        `${axiosInstance.defaults.baseURL}/auth/signin`
      );

      const res = await axiosInstance.post<SigninResponse>('/auth/signin', {
        email_or_username: emailOrUsername,
        password,
      });

      const { user, token } = res.data;

      if (!user || !token) {
        throw new Error('Invalid response: missing user or token');
      }

      console.info('[useSignIn] Login successful:', { user, token });

      const avatarPath = `/avatars/${user.id}.png`;
      localStorage.setItem('avatar_url', avatarPath);

      const userWithAvatar: UserOut = { ...user, avatar_url: avatarPath };

      setToken(token);
      setUser(userWithAvatar);

      console.debug('[useSignIn] User + token saved to store:', { user, token });

      navigate('/dashboard');
    } catch (err) {
      console.error('[useSignIn] Login failed:', err);

      let message = 'Sign in failed. Please try again.';

      if (axiosInstance.isAxiosError(err)) {
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
      }

      setError(message);
    }
  };

  return { signIn, error };
};
