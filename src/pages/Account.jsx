import { useAuthStore } from '@/store/useAuthStore'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { User, Settings } from 'lucide-react'

export default function Account() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="p-6 text-center text-white/70">
        Loading user profile...
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <GlassCard size="medium" elevation="glass" className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white text-xl font-bold shadow-inner">
          {user.avatar ? (
            <img src={user.avatar} alt="Avatar" className="rounded-full w-full h-full object-cover" />
          ) : (
            user.username?.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-lg font-semibold text-white">{user.username}</div>
          <div className="text-sm text-white/70">{user.email}</div>
          {user.role === 'admin' && (
            <span className="mt-1 inline-block text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
              Admin
            </span>
          )}
        </div>
      </GlassCard>

      <GlassCard size="compact" elevation="md" className="flex justify-between items-center">
        <div className="text-white/90 text-sm">Manage your settings and preferences</div>
        <Button icon={<Settings size={16} />} onClick={() => navigate('/settings')}>
          Settings
        </Button>
      </GlassCard>

      <GlassCard size="compact" elevation="md" className="flex justify-between items-center">
        <div className="text-white/90 text-sm">View your uploads, jobs, and favorites</div>
        <Button icon={<User size={16} />} onClick={() => navigate('/dashboard')}>
          Dashboard
        </Button>
      </GlassCard>
    </div>
  )
}