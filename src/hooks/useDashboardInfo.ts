import { useEffect, useState } from 'react'
import { dashboardsService } from '@/api/services/dashboardsServices'
import { membersService } from '@/api/services/membersServices'
import { usersService } from '@/api/services/usersServices'

export function useDashboardInfo(
  dashboardId: number,
  pageType: 'mydashboard' | 'dashboard' | 'mypage'
) {
  const [dashboardTitle, setDashboardTitle] = useState('')
  const [memberCount, setMemberCount] = useState(0)
  const [hasCrown, setHasCrown] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  useEffect(() => {
    const fetchDashboardDetails = async () => {
      try {
        const dashboardData = await dashboardsService.getDashboardsDetail(
          dashboardId
        )
        const { title, createdByMe } = dashboardData

        setDashboardTitle(createdByMe ? `${title} 👑` : title) // 현재 대시보드페이지에서도 왕관 이미지를 가지고 오고 있는데 이건 대시보드 페이지 테스트 하고 어떤게 나은지 보고 둘 중 하나 지우겠습니다.
        setHasCrown(createdByMe)
      } catch (error) {
        console.error('대시보드 조회 실패:', error)
      }
    }

    const fetchMembers = async () => {
      try {
        const membersData = await membersService.getMembers(dashboardId, 1, 100)
        setMemberCount(membersData.totalCount)
      } catch (error) {
        console.error('멤버 조회 실패:', error)
      }
    }
    const fetchUser = async () => {
      try {
        const userData = await usersService.getUsers()
        console.log(userData)
        setUserName(userData.nickname)
        setUserEmail(userData.email)
      } catch (error) {
        console.error('내 정보 조회 실패:', error)
      }
    }

    fetchDashboardDetails()
    fetchUser()

    if (pageType === 'dashboard') {
      fetchMembers()
    }
  }, [dashboardId, pageType])

  return { dashboardTitle, hasCrown, memberCount, userName, userEmail }
}
