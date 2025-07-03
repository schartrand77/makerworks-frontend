// src/hooks/useClickAway.ts
import { useEffect, useRef } from 'react'

const useClickAway = (onClickAway: () => void) => {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickAway()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClickAway])

  return ref
}

export default useClickAway
