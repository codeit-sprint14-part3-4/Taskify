import { useEffect, useState } from 'react'
import { dashboardsService } from '@/api/services/dashboardsServices'
import { membersService } from '@/api/services/membersServices'

export function useDashboardInfo(
  dashboardId: number,
  pageType: 'mydashboard' | 'dashboard'
) {
  const [dashboardTitle, setDashboardTitle] = useState('')
  const [memberCount, setMemberCount] = useState(0)
  const [hasCrown, setHasCrown] = useState(false)

  useEffect(() => {
    const fetchDashboardDetails = async () => {
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

    const fetchMembers = async () => {
      try {
        const membersData = await membersService.getMembers(dashboardId, 1, 100)
        setMemberCount(membersData.totalCount)
      } catch (error) {
        console.error('멤버 조회 실패:', error)
      }
    }

    fetchDashboardDetails()

    if (pageType === 'dashboard') {
      fetchMembers()
    }
  }, [dashboardId, pageType])

  return { dashboardTitle, hasCrown, memberCount }
}
