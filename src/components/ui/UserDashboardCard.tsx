// src/components/ui/UserDashboardCard.tsx
import { useAuthStore } from '@/store/useAuthStore'
import GlassCard from '@/components/ui/GlassCard'
import { useNavigate } from 'react-router-dom'

const UserDashboardCard = () => {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

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
        <button
          onClick={() => {
            navigate('/settings')
          }}
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
            useAuthStore.getState().logout()
            window.location.href = '/'
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
  )
}

export default UserDashboardCard