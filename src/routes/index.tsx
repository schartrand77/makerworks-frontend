import { useRoutes } from 'react-router-dom'
import { routes } from './routes'

export default function RoutesRenderer() {
  const element = useRoutes(routes)
  return element
}
