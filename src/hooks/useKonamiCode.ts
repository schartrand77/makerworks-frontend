import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import axios from '@/api/axios'

const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a', 'Enter',
]

export function useKonamiCode() {
  const navigate = useNavigate()

  useEffect(() => {
    let position = 0

    const activateGodMode = async () => {
      console.log('👑 Konami code entered — unlocking admin!')

      const store = useAuthStore.getState()
      if (!store.isGodMode) {
        store.setGodMode()
        localStorage.setItem('godMode', 'true')

        try {
          await axios.post('/api/admin/unlock')
          console.log('🔓 Backend admin unlock route called successfully.')
        } catch (err) {
          console.error('❌ Failed to call /api/admin/unlock:', err)
        }
      }

      // ✅ navigate to /admin
      navigate('/admin', { replace: true })
    }

    const handler = (e: KeyboardEvent) => {
      if (e.key === KONAMI_SEQUENCE[position]) {
        position++
        if (position === KONAMI_SEQUENCE.length) {
          activateGodMode()
          position = 0
        }
      } else {
        position = 0
      }
    }

    window.addEventListener('keydown', handler)

    // re-apply godMode on mount if previously enabled
    const store = useAuthStore.getState()
    if (localStorage.getItem('godMode') === 'true' && !store.isGodMode) {
      activateGodMode()
    }

    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [navigate])
}