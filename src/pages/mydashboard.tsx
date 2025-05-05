import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './mydashboard.module.css'

import Layout from '@/components/layout/layout'
import DashboardList from '@/components/domain/mydashboard/dashboardlist/DashboardList'
import MyInvitedDashboard from '@/components/domain/mydashboard/dashboardinvitedlist/MyInvitedDashboard'
import { invitationsService } from '@/api/services/invitationsServices'
import { Invitation } from '@/types/api/invitations'
import MyDropDown from '@/components/dropdown/MyDropDown'

export default function MyDashboardPage() {
  const [invitedList, setInvitedList] = useState<Invitation[]>([])
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
    <div className="p-[4rem]">
      <DashboardList />
      {/* 드롭다운 컴포넌트 나중에 삭제하세요 일단 테스트입니다 홈네브바에 해야 함!!!
      <MyDropDown /> */}
      {loadingInvited ? (
        <div className="text-center text-gray-500 mt-8">
          초대 목록 로딩 중...
        </div>
      ) : invitedList.length === 0 ? (
        <div className="justify-center items-center bg-white rounded-[1.6rem] shadow-[0_0_6px_rgba(0,_0,_0,_0.05)]   xl:w-[96rem] xl:mt-[7.4rem]   md:p-[2.4rem_4rem]  md:w-[50.4rem] md:h-[39rem]   p-[2.4rem_2rem] w-[26rem] h-[32.7rem]  ">
          <div className="md:text-2xl-bold text-md-bold">초대받은 대시보드</div>
          <div className=" flex flex-col items-center gap-[2.4rem] text-[#8c8c8c] pt-16 md:mt-0 mt-[6.4rem]">
            <div className="relative  md:w-[10rem] md:h-[10rem] w-[6rem] h-[6rem]  ">
              <Image src="/assets/icon/email.svg" alt="email" fill />
            </div>
            <div className="md:text-2lg-regular text-xs-regular">
              아직 초대받은 대시보드가 없어요
            </div>
          </div>
        </div>
      ) : (
        <MyInvitedDashboard />
      )}
    </div>
  )
}

MyDashboardPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout pageType="mydashboard">{page}</Layout>
}
