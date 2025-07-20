import React, { createContext, useContext } from 'react';
// If you’re using sonner (recommended for modern projects), import it:
import { Toaster, toast } from 'sonner';
// If you prefer react-toastify, replace above with:
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

interface ToastContextProps {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const show = (type: 'success' | 'error' | 'info', message: string) => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'info':
      default:
        toast(message);
        break;
    }
  };

  const value: ToastContextProps = {
    success: (msg) => show('success', msg),
    error: (msg) => show('error', msg),
    info: (msg) => show('info', msg),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Mount the toaster component here */}
      <Toaster
        position="top-right"
        richColors
        expand
        duration={4000}
      />
      {/* If using react-toastify, replace above with:
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} /> */}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
