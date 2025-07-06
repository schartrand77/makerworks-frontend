import { lazy } from 'react'
import { JSX } from 'react'
import { Home, Upload, Settings as Cog, Users, FileText, Eye } from 'lucide-react'
import NotFoundPage from '@/pages/PageNotFound'

// 📄 define route paths in one place
export const RoutePaths = {
  Home: '/',
  SignIn: '/auth/signin',
  SignUp: '/auth/signup',
  Dashboard: '/dashboard',
  Upload: '/upload',
  Estimate: '/estimate',
  Settings: '/settings',
  Browse: '/browse',
  Admin: '/admin',
}

// 📄 lazy load all page components
const Landing = lazy(() => import('@/pages/Landing'))
const SignIn = lazy(() => import('@/components/auth/SignIn'))
const SignUp = lazy(() => import('@/components/auth/SignUp'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Estimate = lazy(() => import('@/pages/Estimate'))
const Upload = lazy(() => import('@/pages/Upload'))
const Settings = lazy(() => import('@/pages/Settings'))
const Browse = lazy(() => import('@/pages/Browse'))
const Admin = lazy(() => import('@/pages/Admin'))

export interface AppRoute {
  path: string
  element: JSX.Element
  role?: string // for specific role-based check
  access?: 'public' | 'protected' | 'admin'
  title?: string
  hidden?: boolean
  icon?: JSX.Element
  description?: string
}

export const routes: AppRoute[] = [
  {
    path: RoutePaths.Home,
    element: <Landing />,
    access: 'public',
    title: 'Home',
    icon: <Home />,
    description: 'Welcome to MakerWorks',
  },
  {
    path: RoutePaths.SignIn,
    element: <SignIn />,
    access: 'public',
    title: 'Sign In',
    hidden: true,
  },
  {
    path: RoutePaths.SignUp,
    element: <SignUp />,
    access: 'public',
    title: 'Sign Up',
    hidden: true,
  },
  {
    path: RoutePaths.Dashboard,
    element: <Dashboard />,
    access: 'protected',
    title: 'Dashboard',
    icon: <Eye />,
    description: 'Your personal dashboard',
  },
  {
    path: RoutePaths.Upload,
    element: <Upload />,
    access: 'protected',
    title: 'Upload',
    icon: <Upload />,
    description: 'Upload new models',
  },
  {
    path: RoutePaths.Estimate,
    element: <Estimate />,
    access: 'protected',
    title: 'Estimate',
    icon: <FileText />,
    description: 'Estimate print jobs',
  },
  {
    path: RoutePaths.Settings,
    element: <Settings />,
    access: 'protected',
    title: 'Settings',
    icon: <Cog />,
    description: 'Manage your account settings',
  },
  {
    path: RoutePaths.Browse,
    element: <Browse />,
    access: 'protected',
    title: 'Browse',
    icon: <Eye />,
    description: 'Browse available models',
  },
  {
    path: RoutePaths.Admin,
    element: <Admin />,
    role: 'MakerWorks-Admin',
    access: 'admin',
    title: 'Admin',
    icon: <Users />,
    description: 'Admin panel for managing the platform',
  },
  {
    path: '*',
    element: <NotFoundPage />,
    hidden: true,
  },
]