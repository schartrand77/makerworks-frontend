import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import axios from '@/api/axios';

const AuthCallback = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      console.error('No authorization code found.');
      navigate('/auth/signin');
      return;
    }

    const exchangeCode = async () => {
      try {
        const res = await axios.post('/auth/token', {
          code,
          redirect_uri: import.meta.env.VITE_AUTHENTIK_REDIRECT_URI,
        });

        const { token, user } = res.data;

        if (token) {
          setToken(token);
          setUser(user);
          navigate('/dashboard');
        } else {
          console.error('No token received from backend');
          navigate('/auth/signin');
        }
      } catch (err) {
        console.error('Failed to exchange code:', err);
        navigate('/auth/signin');
      }
    };

    exchangeCode();
  }, [navigate, setUser, setToken]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Signing you in…</p>
    </div>
  );
};

export default AuthCallback;
