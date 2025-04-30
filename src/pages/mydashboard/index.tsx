import styles from './mydashboard.module.css'
import Image from 'next/image'
import { useState } from 'react'

import Layout from '@/components/layout/layout'
import DashboardCreateModal from '@/components/domain/modals/dashboardCreateModal/DashboardCreateModal'
import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'

export default function MyDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateDashboardModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseDashboardModal = () => {
    setIsModalOpen(false)
  }

  return (
    <Layout pageType="mydashboard">
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
              src="/assets/icon/add_box.svg"
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
        <section className={styles.invite_section}>
          <div className={`${styles.invite_title} text-2xl-bold`}>
            초대받은 대시보드
          </div>
          <div className={styles.invite_box}>
            <Image
              src="/assets/icon/email.svg"
              alt="email"
              width={100}
              height={100}
            />
            <div className={styles.invite_message}>
              아직 초대받은 대시보드가 없어요
            </div>
          </div>
        </section>

        {/* 대시보드 생성 모달 */}
        {isModalOpen && (
          <DashboardCreateModal onClose={handleCloseDashboardModal} />
        )}
      </main>
    </Layout>
  )
}
