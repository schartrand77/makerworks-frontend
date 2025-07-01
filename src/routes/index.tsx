import { Routes, Route } from 'react-router-dom'
import ProtectedLayout from '@/layouts/ProtectedLayout'
import PageLayout from '@/components/layout/PageLayout'

import Landing from '@/pages/Landing'
import SignIn from '@/pages/auth/SignIn'
import SignUp from '@/pages/auth/SignUp'

import Dashboard from '@/pages/Dashboard'
import Estimate from '@/pages/Estimate'
import Upload from '@/pages/Upload'
import Settings from '@/pages/Settings'
import Browse from '@/pages/Browse'
import Admin from '@/pages/Admin'

export default function AppRoutes(): JSX.Element {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />

      {/* Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedLayout>
            <Upload />
          </ProtectedLayout>
        }
      />
      <Route
        path="/estimate"
        element={
          <ProtectedLayout>
            <Estimate />
          </ProtectedLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedLayout>
            <Settings />
          </ProtectedLayout>
        }
      />
      <Route
        path="/browse"
        element={
          <ProtectedLayout>
            <Browse />
          </ProtectedLayout>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedLayout role="MakerWorks-Admin">
            <Admin />
          </ProtectedLayout>
        }
      />

      {/* 404 fallback */}
      <Route
        path="*"
        element={
          <PageLayout title="Page Not Found">
            <p className="text-zinc-500 dark:text-zinc-400">
              This page doesn’t exist. Try the dashboard or home.
            </p>
          </PageLayout>
        }
      />
    </Routes>
  )
}