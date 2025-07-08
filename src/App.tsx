import { BrowserRouter } from 'react-router-dom'
import RoutesRenderer from '@/routes'

function AppContent() {
  return <RoutesRenderer />
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}