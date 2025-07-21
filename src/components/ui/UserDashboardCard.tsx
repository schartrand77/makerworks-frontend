// src/components/ui/UserDashboardCard.tsx
import { useUser } from '@/hooks/useUser';
import GlassCard from '@/components/ui/GlassCard';
import { useNavigate } from 'react-router-dom';

const UserDashboardCard = () => {
  const navigate = useNavigate();
  const { user, avatar, signOut } = useUser();

  if (!user) return null;

  // Prefer avatar from state → user.avatar_url → thumbnail → default
  const avatarSrc =
    avatar ||
    user.avatar_url ||
    user.thumbnail_url ||
    '/default-avatar.png';

  return (
    <GlassCard className="w-full max-w-md p-6 text-center flex flex-col items-center gap-4 shadow-[0_8px_20px_rgba(128,128,128,0.15)]">
      <div className="w-20 h-20 rounded-full bg-zinc-300 dark:bg-zinc-700 overflow-hidden shadow-md">
        {avatarSrc && !avatarSrc.includes('default') ? (
          <img
            src={avatarSrc}
            alt="User avatar"
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.src = '/default-avatar.png';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-semibold text-xl text-white dark:text-zinc-200">
            {user.username?.[0]?.toUpperCase() ?? 'U'}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {user.username}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {user.email}
        </p>
      </div>

      <div className="mt-4 flex gap-3 justify-center">
        <button
          onClick={() => navigate('/settings')}
          className="
            px-5 py-2 rounded-full
            bg-blue-500 text-white
            shadow hover:bg-blue-600
            transition text-sm
          "
        >
          Edit Profile
        </button>
        <button
          onClick={() => {
            signOut();
            window.location.href = '/';
          }}
          className="
            px-5 py-2 rounded-full
            bg-red-500 text-white
            shadow hover:bg-red-600
            transition text-sm
          "
        >
          Log Out
        </button>
      </div>
    </GlassCard>
  );
};

export default UserDashboardCard;
