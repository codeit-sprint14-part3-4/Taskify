import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './mydashboard.module.css'

import Layout from '@/components/layout/layout'
import DashboardList from '@/components/domain/mydashboard/dashboardlist/DashboardList'
import MyInvitedDashboard from '@/components/domain/mydashboard/dashboardinvitedlist/MyInvitedDashboard'
import { invitationsService } from '@/api/services/invitationsServices'
import { Invitation } from '@/types/api/invitations'

export default function MyDashboardPage() {
  const [invitedList, setInvitedList] = useState([])
  const [loadingInvited, setLoadingInvited] = useState(true)

  const fetchInvitedlist = async () => {
    try {
      const res = await invitationsService.getInvitations()
      setInvitedList(res.invitations)
    } catch (err) {
      console.error('초대 목록을 불러오는 데 실패했습니다.', err)
    } finally {
      setLoadingInvited(false)
    }
  }

  useEffect(() => {
    fetchInvitedlist()
  }, [])

  return (
    <div className={styles.wrapper}>
      <DashboardList />
      {loadingInvited ? (
        <div className="text-center text-gray-500 mt-8">
          초대 목록 로딩 중...
        </div>
      ) : invitedList.length === 0 ? (
        <div className={styles.invite_section}>
          <div className="flex flex-col items-center gap-[2.4rem] text-[#8c8c8c]">
            <Image
              src="/assets/icon/email.svg"
              alt="email"
              width={100}
              height={100}
            />
            <div className="text-[1.8rem]">아직 초대받은 대시보드가 없어요</div>
          </div>
        </div>
      ) : (
        <MyInvitedDashboard invitedList={invitedList} />
      )}
    </div>
  )
}

MyDashboardPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout pageType="mydashboard">{page}</Layout>
}
