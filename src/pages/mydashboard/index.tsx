import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import styles from './mydashboard.module.css'
import DashboardCreateModal from '@/components/domain/modals/dashboardCreateModal/DashboardCreateModal'
import Image from 'next/image'
import { useState } from 'react'

import HomeNavBar from '@/components/layout/gnb/HomeNavBar'
import Sidebar from '@/components/layout/sidebar/Sidebar'

export default function MyDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleCreateDashboardModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseDashboardModal = () => {
    setIsModalOpen(false)
  }
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
        <HomeNavBar pageType="mydashboard" />
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

        {isModalOpen && (
          <DashboardCreateModal onClose={handleCloseDashboardModal} />
        )}
      </main>
    </div>
  )
}
