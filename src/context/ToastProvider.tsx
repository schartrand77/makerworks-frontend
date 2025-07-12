import React, { createContext, useState, useCallback } from 'react'
import Toast from '@/components/ui/Toast'

type ToastType = 'info' | 'success' | 'error'

interface ToastState {
  message: string
  type: ToastType
  show: boolean
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastState, setToastState] = useState<ToastState>({
    message: '',
    type: 'info',
    show: false,
  })

  const showToast = useCallback(
    (msg: any, t: any = 'info') => {
      const safeMessage =
        typeof msg === 'string'
          ? msg
          : typeof msg?.message === 'string'
          ? msg.message
          : JSON.stringify(msg)

      const safeType: ToastType =
        t === 'success' || t === 'error' || t === 'info' ? t : 'info'

      setToastState({ message: safeMessage, type: safeType, show: true })

      setTimeout(() => {
        setToastState({ message: '', type: 'info', show: false })
      }, 3000)
    },
    []
  )

  return (
    <ToastContext.Provider value={{ toast: showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50">
        <Toast
          message={toastState.message}
          type={toastState.type}
          show={toastState.show}
          onClose={() =>
            setToastState({ message: '', type: 'info', show: false })
          }
        />
      </div>
    </ToastContext.Provider>
  )
}
