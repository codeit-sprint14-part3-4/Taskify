import { useEffect, useState } from 'react'
import { dashboardsService } from '@/api/services/dashboardsServices'
import { membersService } from '@/api/services/membersServices'
import { usersService } from '@/api/services/usersServices'

export function useDashboardInfo(
  dashboardId: number,
  pageType: 'mydashboard' | 'dashboard' | 'mypage',
  userName: string
) {
  const [dashboardTitle, setDashboardTitle] = useState('')
  const [memberCount, setMemberCount] = useState(0)
  const [hasCrown, setHasCrown] = useState(false)
  const [currentUserName, setCurrentUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const fetchDashboardDetails = async () => {
      // 대시보드 페이지일 때만 호출
      if (pageType !== 'mypage') {
        try {
          const dashboardData = await dashboardsService.getDashboardsDetail(
            dashboardId
          )
          const { title, createdByMe } = dashboardData

          setDashboardTitle(createdByMe ? `${title} 👑` : title)
          setHasCrown(createdByMe)
        } catch (error) {
          console.error('대시보드 조회 실패:', error)
        }
      }
    }

    const fetchMembers = async () => {
      // 대시보드 페이지일 때만 호출
      if (pageType === 'dashboard') {
        try {
          const membersData = await membersService.getMembers(
            dashboardId,
            1,
            100
          )
          setMemberCount(membersData.totalCount)
        } catch (error) {
          console.error('멤버 조회 실패:', error)
        }
      }
    }

    const fetchUser = async () => {
      try {
        const userData = await usersService.getUsers()
        setCurrentUserName(userData.nickname)
        setUserEmail(userData.email)
      } catch (error) {
        console.error('내 정보 조회 실패:', error)
      }
    }

    // 호출 순서 및 조건 분기
    fetchUser()
    fetchDashboardDetails()
    if (pageType === 'dashboard') {
      fetchMembers()
    }
  }, [dashboardId, pageType, userName])

  return {
    dashboardTitle,
    hasCrown,
    memberCount,
    userName: currentUserName,
    userEmail,
  }
}
