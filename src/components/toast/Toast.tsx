import { useEffect } from 'react'
import styles from './toast.module.css'

interface ToastProps {
  message: string
  duration?: number
  onClose: () => void
}

export default function Toast({
  message,
  duration = 3000, // 시간 설정하기!!!
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return <div className={styles.toast}>{message}</div>
}
