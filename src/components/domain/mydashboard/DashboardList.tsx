import styles from './dashboardlist.module.css'
import Image from 'next/image'
import { useState } from 'react'

import DashBoardListButton from './DashboardListButton'
import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import ArrowLeft from '../../../../public/assets/icon/arrow-left-gray.svg'
import ArrowRight from '../../../../public/assets/icon/arrow-right-gray.svg'
import Crown from '../../../../public/assets/icon/crown.svg'

export default function MyDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const dashboardsPerPage = 5
  const totalPages = Math.ceil(cardInfo1.dashboards.length / dashboardsPerPage)
  const handleCreateDashboardModal = () => {
    setIsModalOpen(true)
  }

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1)
  }

  const handlePrev = () => {
    if (page > 1) setPage(page - 1)
  }

  const currentDashboards = cardInfo1.dashboards.slice(
    (page - 1) * dashboardsPerPage,
    page * dashboardsPerPage
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.invite_section}>
        <ButtonDashboard
          onClick={handleCreateDashboardModal}
          gap="gap-2"
          className="text-lg-semibold pt-[2.4rem] pr-[9.9rem] pb-[2rem] pl-[9.8rem]"
          suffix={
            <Image
              src="/assets/icon/add_box.svg"
              alt="addbutton"
              width={22}
              height={22}
              className="object-contain flex"
            />
          }
        >
          새로운 대시보드
        </ButtonDashboard>
        {currentDashboards.map((dashboard) => (
          <DashBoardListButton
            key={dashboard.id}
            suffix={
              dashboard.createdByMe && (
                <Image
                  src={Crown}
                  alt="크라운"
                  width={16}
                  height={16}
                  className="object-contain"
                />
              )
            }
          >
            {dashboard.title}
          </DashBoardListButton>
        ))}
        <div className={`${styles.page_wrapper} text-md-regular `}>
          <div className={styles.botton_gap}>
            <span>
              {page} 페이지 중 {totalPages}
            </span>
          </div>
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={styles.page_button_left}
          >
            <div className={styles.crown_center}>
              <Image
                src={ArrowLeft}
                alt="왼쪽페이지버튼"
                width={6}
                height={16}
                className="object-contain flex"
              />
            </div>
          </button>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className={styles.page_button_right}
          >
            <div className={styles.crown_center}>
              <Image
                src={ArrowRight}
                alt="오른쪽페이지버튼"
                width={6}
                height={16}
                className="object-contain flex"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
// 임시 목 데이터
type Dashboard = {
  id: number
  title: string
  color: string
  createdAt: string
  updatedAt: string
  createdByMe: boolean
  userId: number
}

type CardInfo = {
  cursorId: number
  totalCount: number
  dashboards: Dashboard[]
}
const cardInfo1: CardInfo = {
  cursorId: 5,
  totalCount: 20,
  dashboards: [
    {
      id: 1,
      title: '프로젝트 계획서',
      color: '#FF5733',
      createdAt: '2025-04-10T08:00:00Z',
      updatedAt: '2025-04-10T08:00:00Z',
      createdByMe: true,
      userId: 1,
    },
    {
      id: 2,
      title: '디자인 시안',
      color: '#33B5FF',
      createdAt: '2025-04-11T09:30:00Z',
      updatedAt: '2025-04-11T09:30:00Z',
      createdByMe: false,
      userId: 2,
    },
    {
      id: 3,
      title: '마케팅 전략',
      color: '#FFD133',
      createdAt: '2025-04-12T11:15:00Z',
      updatedAt: '2025-04-12T11:15:00Z',
      createdByMe: true,
      userId: 3,
    },
    {
      id: 4,
      title: '서비스 정책',
      color: '#8E44AD',
      createdAt: '2025-04-13T14:00:00Z',
      updatedAt: '2025-04-13T14:00:00Z',
      createdByMe: false,
      userId: 4,
    },
    {
      id: 5,
      title: '리서치 보고서',
      color: '#2ECC71',
      createdAt: '2025-04-14T16:45:00Z',
      updatedAt: '2025-04-14T16:45:00Z',
      createdByMe: true,
      userId: 5,
    },
    {
      id: 6,
      title: '예산안 작성',
      color: '#E67E22',
      createdAt: '2025-04-15T10:10:00Z',
      updatedAt: '2025-04-15T10:10:00Z',
      createdByMe: true,
      userId: 1,
    },
    {
      id: 7,
      title: '팀 회의록',
      color: '#3498DB',
      createdAt: '2025-04-16T13:20:00Z',
      updatedAt: '2025-04-16T13:20:00Z',
      createdByMe: false,
      userId: 2,
    },
    {
      id: 8,
      title: '피드백 정리',
      color: '#9B59B6',
      createdAt: '2025-04-17T08:40:00Z',
      updatedAt: '2025-04-17T08:40:00Z',
      createdByMe: true,
      userId: 3,
    },
    {
      id: 9,
      title: 'QA 체크리스트',
      color: '#1ABC9C',
      createdAt: '2025-04-18T09:00:00Z',
      updatedAt: '2025-04-18T09:00:00Z',
      createdByMe: false,
      userId: 4,
    },
    {
      id: 10,
      title: '고객 설문 결과',
      color: '#F39C12',
      createdAt: '2025-04-19T15:30:00Z',
      updatedAt: '2025-04-19T15:30:00Z',
      createdByMe: true,
      userId: 5,
    },
    {
      id: 11,
      title: '프로토타입 정리',
      color: '#C0392B',
      createdAt: '2025-04-20T12:00:00Z',
      updatedAt: '2025-04-20T12:00:00Z',
      createdByMe: true,
      userId: 1,
    },
    {
      id: 12,
      title: '마일스톤 플래너',
      color: '#2980B9',
      createdAt: '2025-04-21T08:25:00Z',
      updatedAt: '2025-04-21T08:25:00Z',
      createdByMe: false,
      userId: 2,
    },
    {
      id: 13,
      title: '채널 운영 전략',
      color: '#27AE60',
      createdAt: '2025-04-22T11:45:00Z',
      updatedAt: '2025-04-22T11:45:00Z',
      createdByMe: true,
      userId: 3,
    },
    {
      id: 14,
      title: 'SNS 캠페인',
      color: '#D35400',
      createdAt: '2025-04-23T09:50:00Z',
      updatedAt: '2025-04-23T09:50:00Z',
      createdByMe: true,
      userId: 4,
    },
    {
      id: 15,
      title: '콘텐츠 캘린더',
      color: '#E74C3C',
      createdAt: '2025-04-24T10:00:00Z',
      updatedAt: '2025-04-24T10:00:00Z',
      createdByMe: false,
      userId: 5,
    },
    {
      id: 16,
      title: '기획안 초안',
      color: '#16A085',
      createdAt: '2025-04-25T14:20:00Z',
      updatedAt: '2025-04-25T14:20:00Z',
      createdByMe: true,
      userId: 1,
    },
    {
      id: 17,
      title: '사용자 여정 맵',
      color: '#F1C40F',
      createdAt: '2025-04-26T15:00:00Z',
      updatedAt: '2025-04-26T15:00:00Z',
      createdByMe: true,
      userId: 2,
    },
    {
      id: 18,
      title: '경쟁사 분석',
      color: '#34495E',
      createdAt: '2025-04-27T13:00:00Z',
      updatedAt: '2025-04-27T13:00:00Z',
      createdByMe: false,
      userId: 3,
    },
    {
      id: 19,
      title: '사용자 인터뷰',
      color: '#7F8C8D',
      createdAt: '2025-04-28T16:00:00Z',
      updatedAt: '2025-04-28T16:00:00Z',
      createdByMe: true,
      userId: 4,
    },
    {
      id: 20,
      title: '출시 일정표',
      color: '#BDC3C7',
      createdAt: '2025-04-29T17:00:00Z',
      updatedAt: '2025-04-29T17:00:00Z',
      createdByMe: false,
      userId: 5,
    },
  ],
}
