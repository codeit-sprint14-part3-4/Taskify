import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import HomeNavBar from './gnb/HomeNavBar'
import Sidebar from './sidebar/Sidebar'
import { useAuthStore } from '@/stores/auth'
import { dashboardsService } from '@/api/services/dashboardsServices'
import FormModal from '@/components/domain/modals/basemodal/FormModal'

interface LayoutProps {
  children: React.ReactNode
  pageType: 'mydashboard' | 'dashboard' | 'mypage'
}

export default function Layout({ children, pageType }: LayoutProps) {
  const { accessToken, userId } = useAuthStore()
  const router = useRouter()
  const dashboardId = Number(router.query.id)

  // 초대 모달 상태
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [membersEmail, setMembersEmail] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken) {
      router.push('/login')
    }
  }, [accessToken, router])

  const handleInvite = async () => {
    if (!membersEmail) {
      setError('이메일을 입력하세요.')
      return
    }

    try {
      const response = await dashboardsService.postDashboardsInvitations(
        dashboardId,
        {
          email: membersEmail,
        }
      )

      // 초대 요청 성공 후 초대한 사람 정보 콘솔 출력
      const inviterInfo = response // 전체 초대 정보
      console.log('초대한 사람 정보:', inviterInfo)

      setInviteModalOpen(false)
      setMembersEmail('')
      setError('')
    } catch (err: any) {
      console.error('초대 실패:', err)

      // err.response가 있으면 응답 에러에서 메시지를, 없으면 일반 에러에서 메시지를 처리
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        '로그인 중 문제가 발생했습니다.'
      setError(errorMessage)
    }
  }

  if (!accessToken) {
    return null
  }

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
