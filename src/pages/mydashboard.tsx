import { useEffect, useState } from 'react'
import Image from 'next/image'
import Layout from '@/components/layout/layout'
import DashboardList from '@/components/domain/mydashboard/dashboardlist/DashboardList'
import MyInvitedDashboard from '@/components/domain/mydashboard/dashboardinvitedlist/MyInvitedDashboard'
import { invitationsService } from '@/api/services/invitationsServices'
import { Invitation } from '@/types/api/invitations'

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
      {loadingInvited ? (
        <div className="space-y-[4rem]">
          {/* 📦 1. 대시보드 카드 6개 스켈레톤 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.6rem] animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[6.4rem] bg-gray-200 rounded-[0.8rem]"
              />
            ))}
          </div>

          {/* 📦 2. 초대받은 대시보드 영역 */}
          <div className="bg-white rounded-[1.6rem] shadow-[0_0_6px_rgba(0,_0,_0,_0.05)] xl:w-[96rem] p-[2.4rem] animate-pulse space-y-[2.4rem]">
            {/* 타이틀 */}
            <div className="h-[2.4rem] w-[16rem] bg-gray-200 rounded" />

            {/* 검색창 */}
            <div className="h-[4rem] w-full bg-gray-200 rounded" />

            {/* 테이블 헤더 */}
            <div className="hidden md:grid grid-cols-3 gap-4">
              <div className="h-[1.6rem] w-[6rem] bg-gray-200 rounded" />
              <div className="h-[1.6rem] w-[6rem] bg-gray-200 rounded" />
              <div className="h-[1.6rem] w-[8rem] bg-gray-200 rounded" />
            </div>

            {/* 리스트 5줄 */}
            <div className="flex flex-col space-y-[2rem]">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="grid md:grid-cols-3 grid-cols-1 gap-4 items-center"
                >
                  <div className="h-[2rem] bg-gray-200 rounded w-[60%]" />
                  <div className="h-[2rem] bg-gray-200 rounded w-[40%]" />
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <div className="h-[3.2rem] w-[6rem] bg-gray-200 rounded" />
                    <div className="h-[3.2rem] w-[6rem] bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : invitedList.length === 0 ? (
        <div className="justify-center items-center bg-white rounded-[1.6rem] shadow-[0_0_6px_rgba(0,_0,_0,_0.05)]   xl:w-[96rem] xl:mt-[7.4rem]   md:p-[2.4rem_4rem]  md:w-[50.4rem] md:h-[39rem]   p-[2.4rem_2rem] w-[26rem] h-[32.7rem]  ">
          <div className="md:text-md-bold text-2xl-bold">초대받은 대시보드</div>
          <div className=" flex flex-col items-center gap-[2.4rem] text-[#8c8c8c] pt-16 md:mt-0 mt-[6.4rem]">
            <div className="relative  md:w-[10rem] md:h-[10rem] w-[6rem] h-[6rem]  ">
              <Image src="/assets/icon/email.svg" alt="email" fill />
            </div>
            <div className="md:text-xs-regular text-2lg-regular">
              아직 초대받은 대시보드가 없어요
            </div>
          </div>
        </div>
      ) : (
        <>
          <MyInvitedDashboard />
        </>
      )}
    </div>
  )
}

MyDashboardPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout pageType="mydashboard">{page}</Layout>
}
