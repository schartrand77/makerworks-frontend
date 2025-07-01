// src/pages/Landing.tsx
import { useEffect } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import GlassCard from '@/components/ui/GlassCard'
import { useUser } from '@/hooks/useUser'
import { useAuthStore } from '@/store/useAuthStore'

const Landing: React.FC = () => {
  const { user, isAuthenticated, loading } = useUser()
  const resolved = useAuthStore((s) => s.resolved)
  const fetchUser = useAuthStore.getState().fetchUser

  const isAuthed = typeof isAuthenticated === 'function' && isAuthenticated()

  // 🔁 Force hydration if missing
  useEffect(() => {
    if (!resolved && !loading) {
      console.debug('[Landing] Forcing fetchUser() hydration')
      fetchUser?.()
    }
  }, [resolved, loading])

  useEffect(() => {
    console.debug('[Landing] Mounted. Auth state:', {
      loading,
      user,
      isAuthenticated: isAuthenticated ? '[function]' : 'undefined',
      resolved,
    })

    if (!loading && isAuthed) {
      console.info('[Landing] User is authenticated, redirecting to /dashboard')
      window.location.href = '/dashboard'
    }
  }, [loading, user, isAuthenticated, resolved])

  useEffect(() => {
    console.debug('[Landing] ENV:', {
      VITE_AUTHENTIK_LOGIN_URL: import.meta.env.VITE_AUTHENTIK_LOGIN_URL,
      VITE_AUTHENTIK_REGISTER_URL: import.meta.env.VITE_AUTHENTIK_REGISTER_URL,
    })
  }, [])

  console.debug('[Landing] Resolved auth values', {
    loading,
    user,
    isAuthed,
    userId: user?.id,
  })

  return (
    <PageLayout title="MakerWorks">
      <GlassCard>
        <h1 className="text-3xl font-bold mb-2">👋 Welcome to MakerWorks</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          Upload, estimate, and manage your 3D print jobs.
        </p>

        {loading ? (
          <p className="text-sm text-zinc-400">Checking authentication status…</p>
        ) : isAuthed ? (
          <p className="text-sm text-zinc-400">Redirecting to dashboard…</p>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => {
                console.debug('[Landing] Sign In clicked')
                window.location.href = '/auth/signin'
              }}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md text-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                console.debug('[Landing] Sign Up clicked')
                window.location.href = '/auth/signup'
              }}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-800 text-white rounded-md text-sm"
            >
              Sign Up
            </button>
          </div>
        )}
      </GlassCard>
    </PageLayout>
  )
}

export default Landing