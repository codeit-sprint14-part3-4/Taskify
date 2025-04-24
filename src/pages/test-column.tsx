import Column, { ColumnInfo } from '@/components/domain/dashboard/Column'
import { CardInfo } from '@/components/domain/dashboard/Card'

const dummyCards: CardInfo[] = [
  {
    id: 1,
    title: '새로운 일정 관리 Taskify',
    tags: [
      { label: '프로젝트', color: 'tag-orange' },
      { label: '백엔드', color: 'tag-pink' },
      { label: '상', color: 'tag-blue' },
    ],
    dueDate: '2025.04.24',
    assignee: {
      id: 1,
      nickname: 'B',
      profileImageUrl: '/images/profile-b.jpg',
    },
    imageUrl: '/images/sample.jpg',
  },
  {
    id: 2,
    title: '새로운 일정 관리 Taskify',
    tags: [
      { label: '프로젝트', color: 'tag-orange' },
      { label: '상', color: 'tag-blue' },
    ],
    dueDate: '2025.04.24',
    assignee: {
      id: 1,
      nickname: 'B',
      profileImageUrl: '/images/profile-b.jpg',
    },
  },
]

const dummyColumns: ColumnInfo[] = [
  {
    id: 1,
    title: 'To Do',
    dashboardId: 100,
    teamId: '14-4',
    cards: dummyCards,
  },
  {
    id: 2,
    title: 'On Progress',
    dashboardId: 100,
    teamId: '14-4',
    cards: dummyCards,
  },
  {
    id: 3,
    title: '완료',
    dashboardId: 100,
    teamId: '14-4',
    cards: [],
  },
]

export default function TestColumnPage() {
  return (
    <main>
      <Column columnInfo={dummyColumns[0]} />
      <Column columnInfo={dummyColumns[1]} />
    </main>
  )
}
