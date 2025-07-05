// src/components/ui/UserDashboardCard.tsx
import { useAuthStore } from '@/store/useAuthStore';
import GlassCard from '@/components/ui/GlassCard'
import GlassButton from '@/components/ui/GlassButton'

const UserDashboardCard = () => {
  const user = useAuthStore((s) => s.user)

  if (!user) return null

  return (
    <GlassCard className="w-full max-w-md p-6 text-center flex flex-col items-center gap-4">
      <div className="w-20 h-20 rounded-full bg-zinc-300 dark:bg-zinc-700 overflow-hidden shadow-md">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="User avatar"
            className="w-full h-full object-cover rounded-full"
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
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</p>
      </div>

      <div className="mt-4 flex gap-3 justify-center">
        <GlassButton
          onClick={() => {
            // TODO: open modal or settings page
            console.debug('[UserDashboardCard] Edit Profile clicked')
          }}
        >
          Edit Profile
        </GlassButton>
        <GlassButton
          onClick={() => {
            useAuthStore.getState().logout()
            window.location.href = '/'
          }}
          variant="danger"
        >
          Log Out
        </GlassButton>
      </div>
    </GlassCard>
  )
}

export default UserDashboardCard
