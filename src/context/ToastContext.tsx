import React, { createContext, useContext, ReactNode } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type ToastContextType = {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    if (type === 'success') {
      toast.success(message)
    } else if (type === 'error') {
      toast.error(message)
    } else if (type === 'info') {
      toast.info(message)
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        draggable
      />
    </ToastContext.Provider>
  )
}
