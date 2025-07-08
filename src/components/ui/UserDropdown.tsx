import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

type User = {
  username: string;
  email: string;
  avatarUrl?: string;
};

type Props = {
  user: User;
};

const UserDropdown = ({ user }: Props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuthStore();

  const handleSignOut = () => {
    signOut();
    navigate('/auth/signin');
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
        <div className="absolute right-0 mt-2 w-48 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-lg shadow-lg z-50">
          <div className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
            <div className="font-medium">{user.username}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
          <hr className="border-gray-300 dark:border-gray-600" />
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;