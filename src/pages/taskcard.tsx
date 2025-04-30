import { useState } from 'react'
import TaskCardCreateModal from '@/components/domain/modals/TaskCardCreateModal'
import CommonButton from '@/components/common/commonbutton/CommonButton'

export default function TaskCreatePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">할 일 생성 테스트</h1>
      <CommonButton
        variant="primary"
        isActive={true}
        onClick={() => setIsModalOpen(true)}
        className="bg-[var(--violet-5534DhA)] text-white px-6 py-3 rounded-md"
      >
        할 일 생성 모달 열기
      </CommonButton>

      {isModalOpen && <TaskCardCreateModal />}
    </div>
  )
}
