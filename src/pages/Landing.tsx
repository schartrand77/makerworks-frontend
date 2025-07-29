// src/pages/Landing.tsx
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect, useState } from 'react'
import GlassCard from '@/components/ui/GlassCard'

const Landing = () => {
  const navigate = useNavigate()
  const { isAuthenticated, resolved } = useAuthStore()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHydrated(true), 0)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (hydrated && resolved && isAuthenticated()) {
      navigate('/dashboard', { replace: true })
    }
  }, [hydrated, resolved, isAuthenticated, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-brand-accent dark:from-brand-secondary dark:to-brand-primary">
      <GlassCard>
        <div className="flex flex-col items-center justify-center text-center p-8">
          <h1 className="text-4xl font-bold mb-6">MakerWorks</h1>
          <button
            onClick={() => navigate('/auth/signin')}
            className="px-8 py-3 bg-brand-primary hover:bg-brand-highlight text-black font-medium rounded-full shadow-lg"
          >
            Enter Site
          </button>
        </div>
      </GlassCard>
    </div>
  )
}

export default Landing
