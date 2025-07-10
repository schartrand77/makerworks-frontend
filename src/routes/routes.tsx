import { Home, Upload, Settings as Cog, Users, FileText, Eye } from 'lucide-react'
import { RoutePaths } from './RoutesRenderer'

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
    path: RoutePaths.landing,
    title: 'Home',
    icon: <Home />,
    description: 'Welcome to MakerWorks',
    access: 'public',
  },
  {
    path: RoutePaths.dashboard,
    title: 'Dashboard',
    icon: <Eye />,
    description: 'Your personal dashboard',
    access: 'protected',
  },
  {
    path: RoutePaths.upload,
    title: 'Upload',
    icon: <Upload />,
    description: 'Upload new models',
    access: 'protected',
  },
  {
    path: RoutePaths.estimate,
    title: 'Estimate',
    icon: <FileText />,
    description: 'Estimate print jobs',
    access: 'protected',
  },
  {
    path: RoutePaths.settings,
    title: 'Settings',
    icon: <Cog />,
    description: 'Manage your account settings',
    access: 'protected',
  },
  {
    path: RoutePaths.browse,
    title: 'Browse',
    icon: <Eye />,
    description: 'Browse available models',
    access: 'protected',
  },
  {
    path: RoutePaths.checkout,
    title: 'Checkout',
    icon: <FileText />,
    description: 'Complete your purchase',
    access: 'protected',
    hidden: true,
  },
  {
    path: RoutePaths.admin,
    title: 'Admin',
    icon: <Users />,
    description: 'Admin panel for managing the platform',
    role: 'MakerWorks-Admin',
    access: 'admin',
  },
] as const

export default routesMeta
