import GlassNavbar from '@/components/ui/GlassNavbar'
import RoutesRenderer from '@/routes'
import { ToastProvider } from '@/context/ToastProvider'

function AppContent() {
  return (
    <div className="pt-16">
      <RoutesRenderer />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <GlassNavbar />
      <AppContent />
    </ToastProvider>
  )
}
