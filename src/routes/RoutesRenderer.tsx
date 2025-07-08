import { Routes, Route } from 'react-router-dom'
import Landing from '@/pages/Landing'
import Admin from '@/pages/Admin'
import RequireAuth from '@/components/auth/RequireAuth'

/**
 * RoutesRenderer — defines the React Router v6 route tree.
 */
export default function RoutesRenderer() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/admin"
        element={
          <RequireAuth adminOnly>
            <Admin />
          </RequireAuth>
        }
      />
      {/* Other routes */}
    </Routes>
  )
}