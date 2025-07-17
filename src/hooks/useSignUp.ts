// src/hooks/useSignUp.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/api/axios';
import { useAuthStore } from '@/store/useAuthStore';

type UseSignUpResult = {
  email: string;
  setEmail: (v: string) => void;
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loading: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => void;
};

export const useSignUp = (): UseSignUpResult => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !username.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);

    try {
      console.debug('[useSignUp] Payload:', { email, username });

      const res = await axios.post('/auth/signup', {
        email,
        username,
        password,
      });

      const { user, token } = res.data;

      if (!user || !token) {
        throw new Error('Invalid response: missing user or token');
      }

      setToken(token); // Zustand persists automatically
      setUser(user);

      console.info('[useSignUp] User registered:', user);

      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('[useSignUp] Signup error', err);

      let message = 'Signup failed';
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        if (Array.isArray(detail)) {
          message = detail
            .map(
              (e: { loc?: string[]; msg?: string }) =>
                `${e.loc?.join('.')}: ${e.msg}`
            )
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

  return {
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  };
};
