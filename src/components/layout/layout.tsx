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
import { useToast } from '@/context/ToastContext'

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
  const { showToast } = useToast()
  const router = useRouter()
  const { accessToken } = useAuthStore()
  const { setMembers } = useDashboardMembers()
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [dashboardTitle, setDashboardTitle] = useState('')
  const [membersEmail, setMembersEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const dashboardId = Number(router.query.id)
  const isEditPage = router.pathname.includes('edit')

  // 초대 처리 함수
  const handleInvite = async () => {
    if (!membersEmail) {
      setErrorMessage('이메일을 입력하세요.')
      return
    }

    try {
      const inviteList = await dashboardsService.getDashboardsInvitations(
        dashboardId,
        1,
        20
      )

      const filteredInviteList = inviteList.invitations.filter(
        (invitation) => invitation.invitee.email === membersEmail
      )
      if (filteredInviteList.length) {
        setErrorMessage('❌ 이미 초대한 이메일입니다 ❌')
        return
      }

      await dashboardsService.postDashboardsInvitations(dashboardId, {
        email: membersEmail,
      })
      setInviteModalOpen(false)
      setMembersEmail('')
      showToast('성공적으로 완료되었습니다!', 'success')
      setErrorMessage('')
    } catch (err) {
      const error = err as Error
      const errorMessage = error.message || '초대 중 문제가 발생했습니다.'
      setErrorMessage(errorMessage)
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

        setDashboardTitle(createdByMe ? `${title}` : title)
        setIsOwner(createdByMe)
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
            isOwner={isOwner}
            isEditPage={isEditPage}
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
          onCreate={handleInvite}
          onCancel={() => {
            setInviteModalOpen(false)
            setMembersEmail('')
          }}
          errorMessage={errorMessage}
          mode="default"
          showCloseButton
          isSubmitDisabled={membersEmail.trim() === ''}
        />
      )}
    </div>
  )
}
