import { Home, Upload, Settings as Cog, Users, FileText, Eye } from 'lucide-react'

/**
 * Define all app route paths in a central place.
 */
export const RoutePaths = {
  Home: '/',
  SignIn: '/auth/signin',
  SignUp: '/auth/signup',
  Dashboard: '/dashboard',
  Upload: '/upload',
  Estimate: '/estimate',
  Settings: '/settings',
  Browse: '/browse',
  Checkout: '/checkout',
  Admin: '/admin',
} as const

/**
 * Route metadata used for navigation, breadcrumbs, etc.
 */
export interface AppRouteMeta {
  path: string
  title: string
  icon?: JSX.Element
  description?: string
  role?: string
  access?: 'public' | 'protected' | 'admin'
  hidden?: boolean
}

export const routesMeta: AppRouteMeta[] = [
  {
    path: RoutePaths.Home,
    title: 'Home',
    icon: <Home />,
    description: 'Welcome to MakerWorks',
    access: 'public',
  },
  {
    path: RoutePaths.Dashboard,
    title: 'Dashboard',
    icon: <Eye />,
    description: 'Your personal dashboard',
    access: 'protected',
  },
  {
    path: RoutePaths.Upload,
    title: 'Upload',
    icon: <Upload />,
    description: 'Upload new models',
    access: 'protected',
  },
  {
    path: RoutePaths.Estimate,
    title: 'Estimate',
    icon: <FileText />,
    description: 'Estimate print jobs',
    access: 'protected',
  },
  {
    path: RoutePaths.Settings,
    title: 'Settings',
    icon: <Cog />,
    description: 'Manage your account settings',
    access: 'protected',
  },
  {
    path: RoutePaths.Browse,
    title: 'Browse',
    icon: <Eye />,
    description: 'Browse available models',
    access: 'protected',
  },
  {
    path: RoutePaths.Checkout,
    title: 'Checkout',
    icon: <FileText />,
    description: 'Complete your purchase',
    access: 'protected',
    hidden: true,
  },
  {
    path: RoutePaths.Admin,
    title: 'Admin',
    icon: <Users />,
    description: 'Admin panel for managing the platform',
    role: 'MakerWorks-Admin',
    access: 'admin',
  },]
