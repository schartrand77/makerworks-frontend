import { Mail, BadgeCheck, UserCircle2 } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function UserDashboardCard({ user }) {
  if (!user) return null

  return (
    <div className="flex flex-col items-start space-y-4 rounded-3xl bg-white/10 dark:bg-black/20 backdrop-blur-md p-6 shadow-md hover:shadow-lg transition-all">
      {/* Avatar + Name */}
      <div className="flex items-center gap-4 w-full">
        <img
          src={user.avatar || '/default-avatar.png'}
          alt="avatar"
          className="w-14 h-14 rounded-full object-cover border shadow-inner"
        />
        <div>
          <p className="text-lg font-semibold">{user.username}</p>
          {user.is_verified && (
            <span className="text-green-400 text-sm inline-flex items-center gap-1">
              <BadgeCheck size={14} /> Verified
            </span>
          )}
        </div>
      </div>

      {/* Email + Role */}
      <div className="text-sm text-gray-300 space-y-1">
        <div className="flex items-center gap-2">
          <Mail size={14} /> <span>{user.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <UserCircle2 size={14} /> <span className="capitalize">{user.role}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-2">
        <Button size="sm" variant="ghost">Settings</Button>
        <Button size="sm" variant="solid">Sign Out</Button>
      </div>
    </div>
  )
}