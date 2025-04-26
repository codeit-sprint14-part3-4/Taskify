import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './toast.module.css'

interface ToastProps {
  message: string
  onClose: () => void
  duration?: number
  type?: 'create' | 'delete' | 'success' | 'info'
}

export default function Toast({
  message,
  onClose,
  duration = 3000,
  type = 'success', // 기본값 success
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (duration > 0) {
      timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // fade-out 후 onClose
      }, duration)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!isVisible) return null

  const toastClass = styles[type]

  return (
    <div className={`${styles.toast} ${toastClass}`}>
      <p>{message}</p>

      <button
        className={styles.closeButton}
        onClick={() => setIsVisible(false)}
        aria-label="닫기"
      >
        <Image
          src="/assets/image/close.svg"
          alt="닫기"
          width={24}
          height={24}
        />
      </button>
    </div>
  )
}
