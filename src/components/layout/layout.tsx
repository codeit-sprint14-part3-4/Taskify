import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import HomeNavBar from './gnb/HomeNavBar'
import Sidebar from './sidebar/Sidebar'
import { useAuthStore } from '@/stores/auth'
import { dashboardsService } from '@/api/services/dashboardsServices'
import FormModal from '@/components/domain/modals/basemodal/FormModal'
import { useDashboardInfo } from '@/hooks/useDashboardInfo'

interface LayoutProps {
  children: React.ReactNode
  pageType: 'mydashboard' | 'dashboard' | 'mypage'
}

const parseDashboardId = (
  value: string | string[] | undefined
): number | null => {
  if (typeof value === 'string' && !isNaN(Number(value))) {
    return Number(value)
  }
  return null
}

export default function Layout({ children, pageType }: LayoutProps) {
  const { accessToken, userName, profileImageUrl } = useAuthStore() // 한 번만 선언
  const router = useRouter()

  // pageType이 mypage일 경우, 대시보드 ID는 null로 설정
  const rawDashboardId =
    pageType === 'mypage' ? null : parseDashboardId(router.query.id)
  const dashboardId = rawDashboardId ?? 0

  const {
    dashboardTitle,
    hasCrown,
    userName: currentUserName,
    memberCount,
    members,
  } = useDashboardInfo(dashboardId, pageType, userName ?? '')

  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [membersEmail, setMembersEmail] = useState('')
  const [error, setError] = useState('')

  // 로그인 상태 확인 및 리다이렉트 처리
  useEffect(() => {
    const token = accessToken || useAuthStore.getState().accessToken
    if (!token) {
      router.push('/login')
    }
  }, [accessToken, router]) // accessToken이 바뀔 때마다 리다이렉트 확인

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

  if (!accessToken) return null // accessToken이 없으면 아무것도 렌더링하지 않음

  return (
    <div className="flex h-screen">
      <div className="w-[300px] shrink-0">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1">
        <header className="h-[70px] shrink-0 border-b border-[var(--gray-D9D9D9)] bg-white">
          <HomeNavBar
            pageType={pageType}
            dashboardId={dashboardId}
            dashboardTitle={dashboardTitle}
            hasCrown={hasCrown}
            userName={currentUserName}
            memberCount={memberCount}
            members={members}
            profileImage={profileImageUrl} // 상태에서 가져온 프로필 이미지 URL을 전달
            onInviteClick={() => setInviteModalOpen(true)}
          />
        </header>
        <main className="flex-1 bg-[var(--gray-FAFAFA)] overflow-auto">
          {children}
        </main>
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
