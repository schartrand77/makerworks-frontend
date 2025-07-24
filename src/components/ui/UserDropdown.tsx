import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';
import axiosInstance from '@/api/axios';
import { toast } from 'sonner';
import type { UserProfile } from '@/types/UserProfile';

type Props = {
  user: UserProfile;
};

const UserDropdown = ({ user }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'dark';

  const handleSignOut = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/signout');
      if (res.status === 200) {
        toast.success('✅ Signed out successfully');
      } else {
        toast.warning(`⚠️ Signout: unexpected status ${res.status}`);
      }
    } catch (err) {
      console.error('[UserDropdown] signout error', err);
      toast.error('⚠️ Signout failed on server. Cleared locally.');
    } finally {
      logout();
      setLoading(false);
      navigate('/');
    }
  };

  const handleGoTo = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const getAbsoluteUrl = (path: string | null | undefined) => {
    if (!path) return null;
    return path.startsWith('http')
      ? path
      : `${import.meta.env.VITE_API_URL}${path}`;
  };

  const avatarSrc =
    getAbsoluteUrl(user.avatar_url) ||
    getAbsoluteUrl(user.thumbnail_url) ||
    '/default-avatar.png';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full overflow-hidden border border-white/20 w-10 h-10 bg-white/10 backdrop-blur shadow"
      >
        <img
          src={avatarSrc}
          alt={user.username}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/default-avatar.png';
          }}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-lg shadow-lg z-50 p-2 space-y-2">
          <div className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
            <div className="font-medium">{user.username}</div>
            <div
              className="text-xs text-gray-500 truncate max-w-[12rem]"
              title={user.email}
            >
              {user.email}
            </div>
          </div>

          <hr className="border-gray-300 dark:border-gray-600" />

          <div className="flex items-center gap-1 justify-center text-xs text-gray-700 dark:text-gray-300">
            <Sun className="w-4 h-4" />
            <button
              onClick={toggleTheme}
              className="w-12 h-6 rounded-full p-0.5 flex items-center"
            >
              <span
                className="w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-300"
                style={{
                  transform: isDark ? 'translateX(24px)' : 'translateX(0)',
                }}
              ></span>
            </button>
            <Moon className="w-4 h-4" />
          </div>

          <button
            onClick={() => handleGoTo('/settings')}
            className="w-full text-center py-2 px-4 text-sm rounded-full backdrop-blur bg-white/20 dark:bg-zinc-800/30 border border-white/20 dark:border-zinc-700/30 text-blue-800 dark:text-blue-200 shadow hover:bg-white/30 dark:hover:bg-zinc-700/50 hover:shadow-md transition"
          >
            Settings
          </button>

          {user.role === 'admin' && (
            <button
              onClick={() => handleGoTo('/admin')}
              className="w-full text-center py-2 px-4 text-sm rounded-full backdrop-blur bg-red-500/20 dark:bg-red-700/30 border border-red-500/30 dark:border-red-700/40 text-red-800 dark:text-red-200 shadow hover:bg-red-500/30 dark:hover:bg-red-700/50 hover:shadow-md transition"
            >
              Admin Panel
            </button>
          )}

          <hr className="border-gray-300 dark:border-gray-600" />

          <button
            onClick={handleSignOut}
            disabled={loading}
            className={`w-full text-center py-2 px-4 text-sm rounded-full backdrop-blur bg-white/20 dark:bg-zinc-800/30 border border-white/20 dark:border-zinc-700/30 text-red-600 dark:text-red-300 shadow hover:bg-white/30 dark:hover:bg-zinc-700/50 hover:shadow-md transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing out…' : 'Sign Out'}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
