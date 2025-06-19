// src/components/dashboard/AccountCard.jsx
export default function AccountCard({ user }) {
  if (!user) {
    return (
      <div className="text-center text-gray-400 italic">
        No user data loaded.
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={user.avatar || '/default-avatar.png'}
        alt="avatar"
        className="w-16 h-16 rounded-full border shadow-inner"
      />
      <div>
        <p className="text-lg font-semibold flex items-center gap-2">
          {user.username}
          {user.is_verified && (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          )}
        </p>
        <div className="flex gap-2 mt-2">
          <Button icon={<Settings size={16} />} variant="glass">
            Settings
          </Button>
          <Button icon={<User size={16} />} variant="glass-outline">
            Public Profile
          </Button>
        </div>
      </div>
    </div>
  )
}