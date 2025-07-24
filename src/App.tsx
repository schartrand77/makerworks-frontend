// src/App.tsx

import { useEffect } from 'react'
import { useSessionRefresh } from '@/hooks/useSessionRefresh'
import GlassNavbar from '@/components/ui/GlassNavbar'
import RoutesRenderer from '@/routes'
import { useAuthStore } from '@/store/useAuthStore'

function AppContent() {
  return (
    <div className="pt-16">
      <RoutesRenderer />
    </div>
  )
}

export default function App() {
  const user = useAuthStore((s) => s.user)
  const { setUser, fetchUser } = useAuthStore.getState()
  useSessionRefresh()

  useEffect(() => {
    let mounted = true

    const runAuthFetch = async () => {
      if (!user && typeof fetchUser === 'function') {
        try {
          const u = await fetchUser()
          if (!u && mounted) {
            console.warn('[App.tsx] 🚫 No user returned from fetchUser')
            typeof setUser === 'function' && setUser(null)
          } else if (u) {
            console.info('[App.tsx] ✅ User fetched successfully:', u)
          }
        } catch (err) {
          console.error('[App.tsx] ❌ Error in fetchUser:', err)
          if (mounted && typeof setUser === 'function') {
            setUser(null)
          }
        }
      }
    }

    runAuthFetch()

    return () => {
      mounted = false
    }
  }, [user])

  return (
    <>
      <GlassNavbar />
      <AppContent />
    </>
  )
}
