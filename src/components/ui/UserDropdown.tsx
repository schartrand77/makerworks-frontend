import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

type User = {
  username: string;
  email: string;
  avatarUrl?: string;
  isAdmin?: boolean;
};

type Props = {
  user: User;
};

const UserDropdown = ({ user }: Props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore(); // 🔷 fixed here
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'dark';

  const handleSignOut = () => {
    logout(); // 🔷 fixed here
    window.location.href = '/'; // same pattern as UserDashboardCard
  };

  const handleGoTo = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full overflow-hidden border border-white/20 w-10 h-10 bg-white/10 backdrop-blur shadow"
      >
        <img
          src={user.avatarUrl || '/default-avatar.png'}
          alt={user.username}
          className="w-full h-full object-cover"
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
              className={`
                w-12 h-6 rounded-full p-0.5 flex items-center
                transition-colors duration-300 relative
                ${isDark
                  ? 'bg-zinc-700/50 justify-end'
                  : 'bg-green-300/50 justify-start'}
                backdrop-blur
                border border-white/20 dark:border-zinc-700/30
                shadow
              `}
              aria-label="Toggle theme"
            >
              <span
                className="
                  w-5 h-5 rounded-full bg-white shadow
                  transform transition-transform duration-300
                "
              ></span>
            </button>
            <Moon className="w-4 h-4" />
          </div>

          <button
            onClick={() => handleGoTo('/settings')}
            className="
              w-full text-center py-2 px-4 text-sm rounded-full
              backdrop-blur
              bg-white/20 dark:bg-zinc-800/30
              border border-white/20 dark:border-zinc-700/30
              text-blue-800 dark:text-blue-200
              shadow
              hover:bg-white/30 dark:hover:bg-zinc-700/50
              hover:shadow-md
              transition
            "
          >
            Settings
          </button>

          {user.isAdmin && (
            <button
              onClick={() => handleGoTo('/admin')}
              className="
                w-full text-center py-2 px-4 text-sm rounded-full
                backdrop-blur
                bg-red-500/20 dark:bg-red-700/30
                border border-red-500/30 dark:border-red-700/40
                text-red-800 dark:text-red-200
                shadow
                hover:bg-red-500/30 dark:hover:bg-red-700/50
                hover:shadow-md
                transition
              "
            >
              Admin Panel
            </button>
          )}

          <hr className="border-gray-300 dark:border-gray-600" />

          <button
            onClick={handleSignOut}
            className="
              w-full text-center py-2 px-4 text-sm rounded-full
              backdrop-blur
              bg-zinc-900/30 dark:bg-zinc-700/30
              border border-zinc-300/20 dark:border-zinc-600/30
              text-white
              shadow
              hover:bg-zinc-900/50 dark:hover:bg-zinc-700/50
              hover:shadow-md
              transition
            "
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;