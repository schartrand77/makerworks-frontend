import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import Upload from './pages/Upload'
import Browse from './pages/Browse'
import Estimate from './pages/Estimate'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Favorites from './pages/Favorites'
import Settings from './pages/Settings'
import GodMode from './pages/GodMode'
import Success from './pages/Success'
import Cancel from './pages/Cancel'
import GlassLayout from './components/GlassLayout'

const AppLayout = () => (
  <GlassLayout>
    <Outlet />
  </GlassLayout>
)

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/auth', element: <Auth /> },
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/upload', element: <Upload /> },
      { path: '/browse', element: <Browse /> },
      { path: '/estimate', element: <Estimate /> },
      { path: '/cart', element: <Cart /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/favorites', element: <Favorites /> },
      { path: '/settings', element: <Settings /> },
      { path: '/godmode', element: <GodMode /> },
      { path: '/checkout/success', element: <Success /> },
      { path: '/checkout/cancel', element: <Cancel /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}