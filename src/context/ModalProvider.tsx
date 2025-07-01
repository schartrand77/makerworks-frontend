// src/context/ModalProvider.jsx

import { useEffect } from 'react'
import { useModal } from '@/hooks/useModal'

export default function ModalProvider({ children }) {
  const { open } = useModal()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      document.body.classList.add('modal-open')
    } else {
      document.body.style.overflow = ''
      document.body.classList.remove('modal-open')
    }
    return () => {
      document.body.style.overflow = ''
      document.body.classList.remove('modal-open')
    }
  }, [open])

  return children
}