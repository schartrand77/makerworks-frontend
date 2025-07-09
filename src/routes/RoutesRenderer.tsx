import { Routes, Route } from 'react-router-dom'

// Pages
import Landing from '@/pages/Landing'
import Admin from '@/pages/Admin'
import Dashboard from '@/pages/Dashboard'
import Browse from '@/pages/Browse'
import Estimate from '@/pages/Estimate'
import Upload from '@/pages/Upload'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'
import Settings from '@/pages/Settings'  // 👈 added
import PageNotFound from '@/pages/PageNotFound'

// Auth
import SignIn from '@/components/auth/SignIn'
import SignUp from '@/components/auth/SignUp'
import RequireAuth from '@/components/auth/RequireAuth'

export const RoutePaths = Object.freeze({
  landing: '/',
  admin: '/admin',
  dashboard: '/dashboard',
  browse: '/browse',
  estimate: '/estimate',
  upload: '/upload',
  cart: '/cart',
  checkout: '/checkout',
  settings: '/settings',      // 👈 added
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
      <Route
        path={RoutePaths.browse}
        element={
          <RequireAuth>
            <Browse />
          </RequireAuth>
        }
      />
      <Route
        path={RoutePaths.estimate}
        element={
          <RequireAuth>
            <Estimate />
          </RequireAuth>
        }
      />
      <Route
        path={RoutePaths.upload}
        element={
          <RequireAuth>
            <Upload />
          </RequireAuth>
        }
      />
      <Route
        path={RoutePaths.cart}
        element={
          <RequireAuth>
            <Cart />
          </RequireAuth>
        }
      />
      <Route
        path={RoutePaths.checkout}
        element={
          <RequireAuth>
            <Checkout />
          </RequireAuth>
        }
      />
      <Route
        path={RoutePaths.settings} // 👈 added
        element={
          <RequireAuth>
            <Settings />
          </RequireAuth>
        }
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}