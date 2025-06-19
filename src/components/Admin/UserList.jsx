// src/components/Admin/UserList.jsx
import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/admin/users')
      .then(res => setUsers(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-sm text-zinc-400">Loading users...</p>
  if (error) return <p className="text-sm text-red-500">Error: {error}</p>

  return (
    <div className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-3">Registered Users</h2>
      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {users.map(user => (
          <li key={user.id} className="py-2">
            <div className="flex justify-between items-center">
              <span>{user.username} <span className="text-xs text-zinc-400">({user.email})</span></span>
              <span className="text-xs text-zinc-500">{user.created_at}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}