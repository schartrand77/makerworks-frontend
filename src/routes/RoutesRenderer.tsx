import { Routes, Route } from 'react-router-dom'

// Pages
import Landing from '@/pages/Landing'
import Admin from '@/pages/Admin'
import Dashboard from '@/pages/Dashboard'
import PageNotFound from '@/pages/PageNotFound'

// Auth
import SignIn from '@/components/auth/SignIn'
import SignUp from '@/components/auth/SignUp'
import RequireAuth from '@/components/auth/RequireAuth'

export const RoutePaths = Object.freeze({
  landing: '/',
  admin: '/admin',
  dashboard: '/dashboard',
  signin: '/auth/signin',
  signup: '/auth/signup',
})

export default function RoutesRenderer() {
  return (
    <Routes>
      <Route path={RoutePaths.landing} element={<Landing />} />
      <Route path={RoutePaths.signin} element={<SignIn />} />
      <Route path={RoutePaths.signup} element={<SignUp />} />
      <Route
        path={RoutePaths.admin}
        element={
          <RequireAuth adminOnly>
            <Admin />
          </RequireAuth>
        }
      />
      <Route
        path={RoutePaths.dashboard}
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}