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
  type = 'success', // 기본값은 success
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  // 자동 닫힘 타이머 설정
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // fade-out 애니메이션 후 onClose 호출
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  // 닫힌 상태면 렌더링하지 않음
  if (!isVisible) return null

  // 타입에 따른 스타일 클래스
  const toastClass = styles[type]

  return (
    <div className={`${styles.toast} ${toastClass}`}>
      <p>{message}</p>

      {/* 닫기 버튼 */}
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
