import { useState, useRef } from 'react'
import Toast from '@/components/toast/Toast'

export default function ModalTestPage() {
  const [toastMessage, setToastMessage] = useState<string>('')
  const [showingToast, setShowingToast] = useState(false)
  const [toastType, setToastType] = useState<'create' | 'delete' | 'success'>(
    'success'
  )
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 토스트 메시지 표시 함수
  const showToast = (msg: string, type: 'create' | 'delete' | 'success') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    setShowingToast(false)

    setTimeout(() => {
      setToastMessage(msg)
      setToastType(type)
      setShowingToast(true)

      timerRef.current = setTimeout(() => {
        setShowingToast(false)
        setToastMessage('')
        timerRef.current = null
      }, 3000)
    }, 50)
  }

  const handleCreate = () => {
    showToast('컬럼 생성: 새 컬럼', 'create')
  }

  const handleDelete = () => {
    showToast('모든 컬럼이 삭제되었습니다!', 'delete')
  }

  const handleSuccess = () => {
    showToast('😊 로그인 완료!', 'success')
  }

  return (
    <div style={{ padding: '20px' }}>
      <div className="flex flex-col items-center justify-center gap-6 mt-[100px]">
        <button
          onClick={handleCreate}
          className="px-10 py-4 bg-purple-600 text-white rounded-lg"
        >
          컬럼 생성
        </button>

        <button
          onClick={handleDelete}
          className="px-10 py-4 bg-red-600 text-white rounded-lg"
        >
          컬럼 삭제
        </button>

        <button
          onClick={handleSuccess}
          className="px-10 py-4 bg-green-600 text-white rounded-lg"
        >
          로그인
        </button>
      </div>

      {showingToast && (
        <Toast
          message={toastMessage}
          onClose={() => {
            setShowingToast(false)
            setToastMessage('')
          }}
          type={toastType}
        />
      )}
    </div>
  )
}
