// src/components/layout/Navbar.tsx
import { useEffect, useState } from 'react'
import DesktopNavbar from './DesktopNavbar'
import MobileDrawer from './MobileDrawer'

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[95%] max-w-6xl -translate-x-1/2">
      <div className="px-6 py-3 flex items-center justify-between rounded-full border border-white/10 dark:border-white/15 bg-white/30 dark:bg-zinc-800/30 backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
        {isMobile ? <MobileDrawer /> : <DesktopNavbar />}
      </div>
    </header>
  )
}

export default Navbar