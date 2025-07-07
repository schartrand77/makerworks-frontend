import { BrowserRouter } from 'react-router-dom'
import RoutesRenderer from '@/routes'

export default function App() {
  return (
    <BrowserRouter>
      <RoutesRenderer />
    </BrowserRouter>
  )
}