import { useState } from 'react'
import Modal from '@/components/modal/Modal'
import FormModal from '@/components/modal/FormModal'
import Toast from '@/components/toast/Toast'

export default function ModalTestPage() {
  const [openSmall, setOpenSmall] = useState(false)
  const [openLarge, setOpenLarge] = useState(false)
  const [openAlertSmall, setOpenAlertSmall] = useState(false)
  const [openAlertLarge, setOpenAlertLarge] = useState(false)

  const [openFormSmall, setOpenFormSmall] = useState(false)
  const [openFormLarge, setOpenFormLarge] = useState(false)
  const [openFormSmallWithClose, setOpenFormSmallWithClose] = useState(false)
  const [openFormLargeWithClose, setOpenFormLargeWithClose] = useState(false)

  const [columnName, setColumnName] = useState('')
  const [error, setError] = useState('')
  const [columns, setColumns] = useState<string[]>([])

  const [toastMessage, setToastMessage] = useState('')
  const [showingToast, setShowingToast] = useState(false)

  const resetFormState = () => {
    setColumnName('')
    setError('')
    setOpenFormSmall(false)
    setOpenFormLarge(false)
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setShowingToast(true)
    setTimeout(() => {
      setShowingToast(false)
      setToastMessage('')
    }, 3000)
  }

  const handleCreate = () => {
    const trimmed = columnName.trim()

    if (!trimmed) {
      setError('이름을 입력해주세요.')
      return
    }

    if (columns.includes(trimmed)) {
      setError('중복된 컬럼 이름입니다.')
      return
    }

    setColumns((prev) => [...prev, trimmed])
    showToast(`컬럼 생성: ${trimmed}`)

    // 여기서 모달 상태를 명시적으로 닫아야 함 !!!
    resetFormState()
    setOpenFormSmallWithClose(false)
    setOpenFormLargeWithClose(false)
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-6 mt-[100px]">
        {/* 기본 Modal 버튼 */}
        <button
          onClick={() => setOpenSmall(true)}
          className="px-10 py-4 bg-green-600 text-white rounded-lg"
        >
          작은 모달 열기
        </button>
        <button
          onClick={() => setOpenLarge(true)}
          className="px-10 py-6 bg-blue-700 text-white rounded-lg"
        >
          큰 모달 열기
        </button>
        <button
          onClick={() => setOpenAlertSmall(true)}
          className="px-10 py-4 bg-gray-700 text-white rounded-lg"
        >
          작은 확인 버튼
        </button>
        <button
          onClick={() => setOpenAlertLarge(true)}
          className="px-10 py-6 bg-gray-800 text-white rounded-lg"
        >
          큰 확인 버튼
        </button>

        {/* FormModal 버튼 */}
        <button
          onClick={() => {
            resetFormState()
            setOpenFormSmall(true)
          }}
          className="px-10 py-4 bg-purple-600 text-white rounded-lg"
        >
          FormModal - Small
        </button>
        <button
          onClick={() => {
            resetFormState()
            setOpenFormLarge(true)
          }}
          className="px-10 py-6 bg-purple-800 text-white rounded-lg"
        >
          FormModal - Large
        </button>

        {/* FormModal 버튼 - 닫기 버튼 포함 */}
        <button
          onClick={() => {
            resetFormState()
            setOpenFormSmallWithClose(true)
          }}
          className="px-10 py-4 bg-pink-600 text-white rounded-lg"
        >
          FormModal - Small (닫기)
        </button>
        <button
          onClick={() => {
            resetFormState()
            setOpenFormLargeWithClose(true)
          }}
          className="px-10 py-6 bg-pink-800 text-white rounded-lg"
        >
          FormModal - Large (닫기)
        </button>

        {/* 컬럼 목록 표시(중복 체크하기) */}
        <div className="px-20 mt-16 text-2xl text-black">
          <strong>현재 컬럼:</strong> {columns.join(', ') || '없음'}
        </div>
      </div>

      {/* 기본 모달 설정하기*/}
      {openSmall && (
        <Modal
          size="small"
          message="컬럼의 모든 카드가 삭제됩니다."
          onConfirm={() => {
            setColumns([])
            showToast('모든 컬럼이 삭제되었습니다!')
            setOpenSmall(false)
          }}
          onCancel={() => setOpenSmall(false)}
          confirmLabel="삭제"
          cancelLabel="취소"
        />
      )}

      {openLarge && (
        <Modal
          size="large"
          message="컬럼의 모든 카드가 삭제됩니다."
          onConfirm={() => {
            setColumns([])
            showToast('모든 컬럼이 삭제되었습니다!')
            setOpenLarge(false)
          }}
          onCancel={() => setOpenLarge(false)}
          confirmLabel="삭제"
          cancelLabel="취소"
        />
      )}

      {/* 경고 모달 창 설정*/}
      {openAlertSmall && (
        <Modal
          size="small"
          message="비밀번호가 일치하지 않습니다."
          onConfirm={() => setOpenAlertSmall(false)}
          confirmLabel="확인"
        />
      )}

      {openAlertLarge && (
        <Modal
          size="large"
          message="비밀번호가 일치하지 않습니다."
          onConfirm={() => setOpenAlertLarge(false)}
          confirmLabel="확인"
        />
      )}

      {/* Form 모달 창 설정*/}
      {openFormSmall && (
        <FormModal
          size="small"
          title="새 컬럼 생성"
          inputLabel="이름"
          inputValue={columnName}
          onChange={(e) => setColumnName(e.target.value)}
          onConfirm={handleCreate}
          onCancel={resetFormState}
          errorMessage={error}
          confirmLabel="생성"
          cancelLabel="취소"
        />
      )}

      {openFormLarge && (
        <FormModal
          size="large"
          title="새 컬럼 생성"
          inputLabel="이름"
          inputValue={columnName}
          onChange={(e) => setColumnName(e.target.value)}
          onConfirm={handleCreate}
          onCancel={resetFormState}
          errorMessage={error}
          confirmLabel="생성"
          cancelLabel="취소"
        />
      )}
      {/* Form 모달 창 설정 - 닫기 버튼 포함 */}
      {openFormSmallWithClose && (
        <FormModal
          size="small"
          title="새 컬럼 생성"
          inputLabel="이름"
          inputValue={columnName}
          onChange={(e) => setColumnName(e.target.value)}
          onConfirm={handleCreate}
          onCancel={() => {
            resetFormState()
            setOpenFormSmallWithClose(false)
          }}
          errorMessage={error}
          confirmLabel="생성"
          cancelLabel="취소"
          showCloseButton // 닫기 버튼
        />
      )}

      {openFormLargeWithClose && (
        <FormModal
          size="large"
          title="새 컬럼 생성"
          inputLabel="이름"
          inputValue={columnName}
          onChange={(e) => setColumnName(e.target.value)}
          onConfirm={handleCreate}
          onCancel={() => {
            resetFormState()
            setOpenFormLargeWithClose(false)
          }}
          errorMessage={error}
          confirmLabel="생성"
          cancelLabel="취소"
          showCloseButton // 닫기 버튼
        />
      )}
      {/* 토스트 메시지 */}
      {showingToast && (
        <Toast
          message={toastMessage}
          onClose={() => {
            setShowingToast(false)
            setToastMessage('')
          }}
        />
      )}
    </>
  )
}
