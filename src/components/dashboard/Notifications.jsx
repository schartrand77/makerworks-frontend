// src/components/dashboard/Notifications.jsx
import { Bell, AlertCircle } from 'lucide-react'

export default function Notifications({ userId }) {
  const notifications = [] // TODO: fetch from API

  return (
    <div>
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Bell size={20} /> Notifications
      </h2>
      {notifications.length === 0 ? (
        <p className="text-gray-400 italic mt-2">You're all caught up!</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {notifications.map((note, i) => (
            <li key={i} className="text-sm text-gray-300 flex gap-2">
              <AlertCircle size={16} className="mt-0.5 text-yellow-500" />
              {note.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}