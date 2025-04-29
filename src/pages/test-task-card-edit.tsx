import TaskCardEditModal from '@/components/domain/modals/TaskCardEditModal'
import type { TagColor } from '@/types/common/tag'

const dummyCardInfo: {
  status: string
  assignee: string
  title: string
  description: string
  dueDate: string
  tags: { label: string; color: TagColor }[]
  imageUrl: string
} = {
  status: 'To Do',
  assignee: '배유철',
  title: '스프린트 12',
  description: '스프린트 12의 아젠다 논의',
  dueDate: '2025.04.28 09:44',
  tags: [
    { label: '프로젝트', color: 'tag-orange' },
    { label: '일반', color: 'tag-green' },
  ],
  imageUrl: '/assets/image/sample-image.png',
}
const users = [
  { id: 1, name: '김이영', badgeColor: '#EF4444' },
  { id: 2, name: '박해일', badgeColor: '#34D399' },
  { id: 3, name: '이원구', badgeColor: '#FBBF24' },
  { id: 4, name: '이아이', badgeColor: '#22C55E' },
  { id: 5, name: '이지사', badgeColor: '#5534DA' },
]
export default function TestTaskCardEditPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-[var(--gray-FAFAFA)]">
      <TaskCardEditModal cardInfo={dummyCardInfo} users={users} />
    </div>
  )
}
