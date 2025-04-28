import TaskCardModal from '@/components/domain/modals/TaskCardModal' // 경로 맞게 수정!
import { useState } from 'react'

export default function TestPage() {
  const [isModalOpen, setIsModalOpen] = useState(true)
  type TagColor =
    | 'tag-orange'
    | 'tag-pink'
    | 'tag-blue'
    | 'tag-green'
    | 'tag-purple'
    | 'tag-yellow'
    | 'tag-red'
    | 'tag-teal'
    | 'tag-brown'
    | 'tag-gray'

  const dummyCard = {
    id: '123',
    title: '할 일 제목',
    description: '할 일 상세 내용',
    tags: [
      { label: '중요', color: 'tag-red' as TagColor },
      { label: '개발', color: 'tag-blue' as TagColor },
    ],
    dueDate: '2025-05-01',
    status: '진행 중',
    assignee: { id: 'user1', name: '홍길동' },
    imageUrl: '/assets/image/desktop.svg',
  }

  const currentUserId = 'user1' // 현재 로그인한 사용자 ID

  return (
    <>
      {isModalOpen && (
        <TaskCardModal
          card={dummyCard}
          currentUserId={currentUserId}
          onClose={() => setIsModalOpen(false)}
          onEdit={(card) => {
            console.log('수정할 카드 데이터:', card)
            // 수정 모달 열기 연결 예정
          }}
          onDelete={(cardId) => {
            console.log('삭제할 카드 ID:', cardId)
            // 카드 삭제 후 목록 갱신 필요
            setIsModalOpen(false)
          }}
        />
      )}
    </>
  )
}
