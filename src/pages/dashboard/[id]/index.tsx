import { useEffect, useState } from 'react'
import Image from 'next/image'
import Sidebar from '@/components/layout/sidebar/Sidebar'
import HomeNavBar from '@/components/layout/gnb/HomeNavBar'
import Column, { ColumnInfo } from '@/components/domain/dashboard/Column'
import ButtonDashboard from '@/components/common/button/ButtonDashboard'

export default function DashboardPage() {
  const [columns, setColumns] = useState<ColumnInfo[]>([])

  useEffect(() => {
    // 임시 더미 데이터
    const dummy: ColumnInfo[] = [
      {
        id: 1,
        title: 'To Do',
        dashboardId: 1,
        teamId: '14-4',
        cards: [
          {
            id: 201,
            title: '새로운 일정 관리 Taskify',
            tags: [
              { label: '프로젝트', color: 'tag-orange' },
              { label: '백엔드', color: 'tag-pink' },
              { label: '상', color: 'tag-blue' },
            ],
            dueDate: '2025-12-31',
            assignee: {
              id: 1,
              nickname: 'B',
              profileImageUrl: '/images/profile-b.jpg',
            },
            imageUrl: '', // 이미지 없는 카드
          },
          {
            id: 202,
            title: '새로운 일정 관리 Taskify',
            tags: [
              { label: '프로젝트', color: 'tag-orange' },
              { label: '백엔드', color: 'tag-pink' },
              { label: '상', color: 'tag-blue' },
            ],
            dueDate: '2025-04-24',
            assignee: {
              id: 1,
              nickname: 'B',
              profileImageUrl: '/images/profile-b.jpg',
            },
            imageUrl: '/images/sample-1.jpg', // 실제 이미지 경로
          },
          {
            id: 203,
            title: '새로운 일정 관리 Taskify',
            tags: [
              { label: '프로젝트', color: 'tag-orange' },
              { label: '상', color: 'tag-blue' },
            ],
            dueDate: '2025-04-24',
            assignee: {
              id: 1,
              nickname: 'B',
              profileImageUrl: '/images/profile-b.jpg',
            },
            imageUrl: '', // 이미지 없는 카드
          },
        ],
      },
      {
        id: 2,
        title: 'On Progress',
        dashboardId: 1,
        teamId: '14-4',
        cards: [
          /* 카드 데이터 */
        ],
      },
      {
        id: 3,
        title: 'Done',
        dashboardId: 1,
        teamId: '14-4',
        cards: [
          /* 카드 데이터 */
        ],
      },
    ]
    setColumns(dummy)
  }, [])

  return (
    <div className="flex">
      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col bg-[var(--gray-FAFAFA)]">
        {/* 상단 GNB */}
        <HomeNavBar />

        {/* 컬럼 리스트 */}
        <div className="flex overflow-x-auto pl-[30rem]">
          {columns.map((column) => (
            <Column key={column.id} columnInfo={column} />
          ))}

          {/* 새로운 컬럼 추가하기 버튼 */}
          <div className="pt-[6.8rem] pl-[2.4rem]">
            <ButtonDashboard
              paddingHeight="pt-[2.4rem] pb-[2rem]"
              paddingWidth="px-[8.6rem]"
              gap="gap-[1.2rem]"
              className="box-border w-full rounded-[8px] border border-[var(--gray-D9D9D9)]"
              color="bg-white text-[#333236] text-2lg-bold"
              suffix={
                <Image
                  src="/assets/icon/add_box.svg"
                  alt="추가 아이콘"
                  width={22}
                  height={22}
                />
              }
            >
              새로운 컬럼 추가하기
            </ButtonDashboard>
          </div>
        </div>
      </div>
    </div>
  )
}
