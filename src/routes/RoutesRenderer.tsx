import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from '@/components/auth/RequireAuth';
import RoutePaths from '@/routes/routePaths';

const Landing = lazy(() => import('@/pages/Landing'));
const Admin = lazy(() => import('@/pages/Admin'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Browse = lazy(() => import('@/pages/Browse'));
const Estimate = lazy(() => import('@/pages/Estimate'));
const Upload = lazy(() => import('@/pages/Upload'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const Settings = lazy(() => import('@/pages/Settings'));
const ModelPage = lazy(() => import('@/pages/ModelPage'));
const SignIn = lazy(() => import('@/components/auth/SignIn'));
const SignUp = lazy(() => import('@/components/auth/SignUp'));
const PageNotFound = lazy(() => import('@/pages/PageNotFound'));

export default function RoutesRenderer() {
  return (
    <Suspense fallback={<div className="text-center mt-8">Loading…</div>}>
      <Routes>
        <Route path={RoutePaths.landing} element={<Landing />} />
        <Route path={RoutePaths.signin} element={<SignIn />} />
        <Route path={RoutePaths.signup} element={<SignUp />} />

        <Route
          path={RoutePaths.admin}
          element={
            <RequireAuth requiredRoles={['admin']}>
              <Admin />
            </RequireAuth>
          }
        />
        <Route
          path={RoutePaths.dashboard}
          element={
            <RequireAuth fallbackTo={RoutePaths.landing}>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path={RoutePaths.browse}
          element={
            <RequireAuth fallbackTo={RoutePaths.landing}>
              <Browse />
            </RequireAuth>
          }
        />
        <Route
          path={RoutePaths.estimate}
          element={
            <RequireAuth fallbackTo={RoutePaths.landing}>
              <Estimate />
            </RequireAuth>
          }
        />
        <Route
          path={RoutePaths.upload}
          element={
            <RequireAuth fallbackTo={RoutePaths.landing}>
              <Upload />
            </RequireAuth>
          }
        />
        <Route
          path={RoutePaths.cart}
          element={
            <RequireAuth fallbackTo={RoutePaths.landing}>
              <Cart />
            </RequireAuth>
          }
        />
        <Route
          path={RoutePaths.checkout}
          element={
            <RequireAuth fallbackTo={RoutePaths.landing}>
              <Checkout />
            </RequireAuth>
          }
        />
        <Route
          path={RoutePaths.model}
          element={
            <RequireAuth fallbackTo={RoutePaths.landing}>
              <ModelPage />
            </RequireAuth>
          }
        />
        <Route
          path={RoutePaths.settings}
          element={
            <RequireAuth fallbackTo={RoutePaths.landing}>
              <Settings />
            </RequireAuth>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}
