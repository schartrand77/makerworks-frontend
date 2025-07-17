import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/api/axios';
import { useAuthStore } from '@/store/useAuthStore';

interface UseSignInResult {
  emailOrUsername: string;
  setEmailOrUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  error: string | null;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

export const useSignIn = (): UseSignInResult => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername.trim() || !password.trim()) {
      setError('Email/username and password are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.debug('[useSignIn] Sending credentials:', { emailOrUsername });

      const res = await axios.post('/auth/signin', {
        email_or_username: emailOrUsername,
        password,
      });

      const { user, token } = res.data;

      if (!user || !token) {
        throw new Error('Invalid response: missing user or token');
      }

      console.info('[useSignIn] Login successful:', { user, token });

      setToken(token); // Zustand handles persistence
      setUser(user);

      console.debug('[useSignIn] User + token saved to store:', { user, token });

      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('[useSignIn] Login failed:', err);

      let message = 'Sign in failed';

      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;

        if (Array.isArray(detail)) {
          const messages = detail
            .map(
              (e: { loc?: string[]; msg?: string }) =>
                `${e.loc?.join('.')}: ${e.msg}`
            )
            .join('; ');
          message = messages;
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

  return {
    emailOrUsername,
    setEmailOrUsername,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  };
};
