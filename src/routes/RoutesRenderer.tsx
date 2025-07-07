import { Routes, Route } from 'react-router-dom'

// 🌐 Layout
import PageLayout from '@/components/layout/PageLayout'

// 📄 Public pages
import Landing from '@/pages/Landing'
import SignIn from '@/components/auth/SignIn'
import SignUp from '@/components/auth/SignUp'
import NotFoundPage from '@/pages/PageNotFound'

// 🔒 Protected pages
import Dashboard from '@/pages/Dashboard'
import Upload from '@/pages/Upload'
import Estimate from '@/pages/Estimate'
import Settings from '@/pages/Settings'
import Browse from '@/pages/Browse'
import Admin from '@/pages/Admin'

/**
 * RoutesRenderer — defines the React Router v6 route tree.
 * 
 * Public pages are available without login.
 * Protected pages are wrapped with PageLayout and require auth.
 */
export default function RoutesRenderer() {
  return (
    <Routes>
      {/* 🌐 Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />

      {/* 🔒 Protected routes — nested inside PageLayout */}
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="upload" element={<Upload />} />
        <Route path="estimate" element={<Estimate />} />
        <Route path="settings" element={<Settings />} />
        <Route path="browse" element={<Browse />} />
        <Route path="admin" element={<Admin />} />
      </Route>

      {/* 🚧 Catch-all route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}