import { useState } from 'react';
import axios from '@/api/axios';
import { toast } from 'sonner';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/token', {
        username,
        password,
      });
      localStorage.setItem('access_token', res.data.access_token);
      toast.success('✅ Login successful');
    } catch (err) {
      console.error(err);
      toast.error('❌ Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-12">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        {loading ? 'Logging in…' : 'Login'}
      </button>
    </div>
  );
}
