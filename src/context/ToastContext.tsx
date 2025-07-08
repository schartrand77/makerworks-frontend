import React, { createContext, useContext, useState, ReactNode } from 'react'
import Toast from '@/components/ui/Toast'

type ToastContextType = {
  showToast: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  const showToast = (msg: string, duration = 3000) => {
    setMessage(msg)
    setVisible(true)
    setTimeout(() => setVisible(false), duration)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 inset-x-0 flex justify-center pointer-events-none">
        <Toast
          message={message}
          show={visible}
          onClose={() => setVisible(false)}
        />
      </div>
    </ToastContext.Provider>
  )
}