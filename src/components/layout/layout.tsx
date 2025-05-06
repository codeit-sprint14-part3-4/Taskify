import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './layout.module.css'

import HomeNavBar from './gnb/HomeNavBar'
import Sidebar from './sidebar/Sidebar'
import { useAuthStore } from '@/stores/auth'
import { dashboardsService } from '@/api/services/dashboardsServices'
import FormModal from '@/components/domain/modals/basemodal/FormModal'
import { membersService } from '@/api/services/membersServices'
import { useDashboardMembers } from '@/stores/dashboardMembers'

interface LayoutProps {
  children: React.ReactNode
  pageType: 'mydashboard' | 'dashboard' | 'mypage'
}

const getRandomColor = () => {
  const colors = [
    '#FFC85A',
    '#FDD446',
    '#9DD7ED',
    '#C4B1A2',
    '#F4D7DA',
    '#A3C4A2',
    '#FF787A',
    '#F4BEFF',
    '#BEC3FF',
    '#BF57B5',
  ]
  const randomIndex = Math.floor(Math.random() * colors.length)
  return colors[randomIndex]
}

export default function Layout({ children, pageType }: LayoutProps) {
  const router = useRouter()
  const { accessToken } = useAuthStore()
  const { setMembers } = useDashboardMembers()
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [hasCrown, setHasCrown] = useState(false)
  const [dashboardTitle, setDashboardTitle] = useState('대시보드 제목 없음')
  const [membersEmail, setMembersEmail] = useState('')
  const [error, setError] = useState('')
  const dashboardId = Number(router.query.id)

  // 초대 처리 함수
  const handleInvite = async () => {
    if (!membersEmail) {
      setError('이메일을 입력하세요.')
      return
    }

    try {
      await dashboardsService.postDashboardsInvitations(dashboardId, {
        email: membersEmail,
      })
      setInviteModalOpen(false)
      setMembersEmail('')
      setError('')
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        '초대 중 문제가 발생했습니다.'
      setError(errorMessage)
    }
  }

  const getDashboardMembers = async (dashboardId: number) => {
    try {
      const res = await membersService.getMembers(1, 20, dashboardId)
      setMembers(
        res.members.map((member) => ({ ...member, badge: getRandomColor() }))
      )
    } catch (err) {
      console.error(err)
    }
  }

  const getDashboardDetails = async (dashboardId: number) => {
    // 대시보드 페이지일 때만 호출
    if (pageType !== 'mypage') {
      try {
        const dashboardData = await dashboardsService.getDashboardsDetail(
          dashboardId
        )
        const { title, createdByMe } = dashboardData

        setDashboardTitle(createdByMe ? `${title} 👑` : title)
        setHasCrown(createdByMe)
      } catch (error) {
        console.error('대시보드 조회 실패:', error)
      }
    }
  }

  // 로그인 상태 확인 및 리다이렉트 처리
  useEffect(() => {
    const token = accessToken || useAuthStore.getState().accessToken
    if (!token) {
      router.push('/login')
      return
    }
  }, [accessToken, router])

  useEffect(() => {
    if (dashboardId) {
      getDashboardMembers(dashboardId)
      getDashboardDetails(dashboardId)
    }
  }, [dashboardId])

  if (!accessToken) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-md-medium text-gray-500">
        로그인 상태를 확인하는 중입니다...
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar_wrapper}>
        <Sidebar currentDashboardId={dashboardId} />
      </div>
      <div className={styles.homenav_wrapper}>
        <header className={styles.header_wrapper}>
          <HomeNavBar
            pageType={pageType}
            dashboardId={dashboardId}
            dashboardTitle={dashboardTitle}
            hasCrown={hasCrown}
            onInviteClick={() => setInviteModalOpen(true)}
          />
        </header>
        <main className={styles.main_wrapper}>{children}</main>
      </div>

      {inviteModalOpen && (
        <FormModal
          size="large"
          title="초대하기"
          inputLabel="이메일"
          inputValue={membersEmail}
          onChange={(e) => setMembersEmail(e.target.value)}
          onConfirm={handleInvite}
          onCancel={() => {
            setInviteModalOpen(false)
            setMembersEmail('')
            setError('')
          }}
          errorMessage={error}
          confirmLabel="초대하기"
          cancelLabel="취소"
          showCloseButton
        />
      )}
    </div>
  )
}
