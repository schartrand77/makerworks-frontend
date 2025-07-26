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
  const token = useAuthStore((s) => s.token)
  const { setUser, fetchUser, setResolved, resolved } = useAuthStore.getState()
  useSessionRefresh()

  useEffect(() => {
    let mounted = true

    const runAuthFetch = async () => {
      try {
        const u = await fetchUser(true)
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
      } finally {
        if (mounted && typeof setResolved === 'function' && !resolved) {
          // ✅ Mark resolved after first fetch attempt to prevent landing/signin loops
          setResolved(true)
        }
      }
    }

    runAuthFetch()

    return () => {
      mounted = false
    }
  }, [token])

  return (
    <>
      <GlassNavbar />
      <AppContent />
    </>
  )
}
