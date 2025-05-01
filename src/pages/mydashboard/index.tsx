import { useAuthStore } from '@/stores/auth'
import { useState, useEffect } from 'react'
import Image from 'next/image'

import Layout from '@/components/layout/layout'
import DashboardCreateModal from '@/components/domain/modals/dashboardCreateModal/DashboardCreateModal'
import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'

export default function MyDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { userId, userData, accessToken } = useAuthStore() // auth.ts에서 가져온 상태 전역관리
  console.log('userId:', userId)
  console.log('userData:', userData)
  const handleCreateDashboardModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseDashboardModal = () => {
    setIsModalOpen(false)
  }
  // 로그인 상태 확인
  useEffect(() => {
    if (!accessToken) {
      window.location.href = '/login'
    }
  }, [accessToken])
  return (
    <main className="p-16">
      {/* 새로운 대시보드 버튼 */}
      <ButtonDashboard
        onClick={handleCreateDashboardModal}
        paddingHeight="py-[22px]"
        paddingWidth="px-[99px]"
        gap="gap-3"
        className="text-lg-semibold"
        suffix={
          <Image
            src="/assets/icon/add-box.svg"
            alt="addbutton"
            width={20}
            height={20}
            className="object-contain flex"
          />
        }
      >
        새로운 대시보드
      </ButtonDashboard>

      {/* 초대받은 대시보드 영역 */}
      <section
        className={
          'bg-[var(--white-FFFFFF)] p-[2.4rem_4rem_12rem_4rem] rounded-[1.6rem] shadow-[0_0_0.6rem_rgba(0,0,0,0.05)] max-w-[96rem] mt-[7.4rem]'
        }
      >
        <div className={`text-2xl-bold mb-[6.4rem] text-[var(--black-333236)]`}>
          초대받은 대시보드
        </div>
        <div
          className={'flex flex-col items-center gap-[2.4rem] text-[#8c8c8c]'}
        >
          <Image
            src="/assets/icon/email.svg"
            alt="email"
            width={100}
            height={100}
          />
          <div className={'text-[1.8rem]'}>아직 초대받은 대시보드가 없어요</div>
        </div>
      </section>

      {/* 대시보드 생성 모달 */}
      {isModalOpen && (
        <DashboardCreateModal onClose={handleCloseDashboardModal} />
      )}
    </main>
  )
}
MyDashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout pageType="mydashboard">{page}</Layout>
}
