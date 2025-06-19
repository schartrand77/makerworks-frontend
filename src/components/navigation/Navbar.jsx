import useMediaQuery from '@/hooks/useMediaQuery'
import MobileBottomNav from './MobileBottomNav'
import DesktopNavbar from './DesktopNavbar'
import { useAuthStore } from '@/store/useAuthStore'

export default function Navbar() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { user, isLoading, signOut } = useAuthStore()

  if (isLoading) return null

  const sharedProps = { user, signOut }

  return isMobile ? (
    <MobileBottomNav {...sharedProps} />
  ) : (
    <DesktopNavbar {...sharedProps} />
  )
}