import { Routes, Route } from 'react-router-dom'
import Landing from '@/pages/Landing'
import Admin from '@/pages/Admin'
import Checkout from '@/pages/Checkout'
import RequireAuth from '@/components/auth/RequireAuth'

/**
 * RoutesRenderer — defines the React Router v6 route tree.
 */
export default function RoutesRenderer() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/checkout"
        element={
          <RequireAuth>
            <Checkout />
          </RequireAuth>
        }
      />
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
  )}