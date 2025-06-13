// src/components/Navbar.jsx
import useMediaQuery from '../hooks/useMediaQuery'
import DesktopNavbar from './DesktopNavbar'
import MobileDrawer from './MobileDrawer'

export default function Navbar() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  return isMobile ? <MobileDrawer /> : <DesktopNavbar />
}