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

export default function TestTaskCardEditPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-[var(--gray-FAFAFA)]">
      <TaskCardEditModal cardInfo={dummyCardInfo} />
    </div>
  )
}
