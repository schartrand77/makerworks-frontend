import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import axios from '@/api/axios';

const AuthCallback = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const returnedState = urlParams.get('state');
    const expectedState = localStorage.getItem('auth_state');

    if (!code) {
      console.error('[AuthCallback] No authorization code found.');
      setError('No authorization code found.');
      navigate('/auth/signin');
      return;
    }

    if (!returnedState || returnedState !== expectedState) {
      console.error('[AuthCallback] Invalid or missing state parameter.', {
        expectedState,
        returnedState,
      });
      setError('Invalid authentication state. Please try again.');
      localStorage.removeItem('auth_state');
      navigate('/auth/signin');
      return;
    }

    // state validated — remove it
    localStorage.removeItem('auth_state');

    const exchangeCode = async () => {
      try {
        const res = await axios.post('/auth/token', {
          code,
          redirect_uri: import.meta.env.VITE_AUTHENTIK_REDIRECT_URI,
        });

        const { token, user } = res.data;

        if (token && user) {
          console.info('[AuthCallback] Successfully exchanged code.');
          setToken(token);
          setUser(user);
          navigate('/dashboard');
        } else {
          console.error('[AuthCallback] No token or user received from backend.');
          setError('Authentication failed. Please try again.');
          navigate('/auth/signin');
        }
      } catch (err) {
        console.error('[AuthCallback] Failed to exchange code:', err);
        setError('Failed to exchange code. Please try again.');
        navigate('/auth/signin');
      }
    };

    exchangeCode();
  }, [navigate, setUser, setToken]);

  return (
    <div className="flex items-center justify-center h-screen">
      {error ? (
        <p className="text-lg text-red-500">{error}</p>
      ) : (
        <p className="text-lg">Signing you in…</p>
      )}
    </div>
  );
};

export default AuthCallback;
