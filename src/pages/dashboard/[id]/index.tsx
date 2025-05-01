import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { dashboardsService } from '@/api/services/dashboardsServices'
import { membersService } from '@/api/services/membersServices'
import Column from '@/components/domain/dashboard/Column'
import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import Layout from '@/components/layout/layout'
import { columnsService } from '@/api/services/columnsServices'
import { ColumnType } from '@/types/api/columns'
import { useAuthStore } from '@/stores/auth'

export default function DashboardPage() {
  const [columns, setColumns] = useState<ColumnType[]>([])
  const { query } = useRouter()
  const { push } = useRouter()
  const dashboardId = Number(query.id)

  const { setDashboardTitle, setMembers } = useAuthStore()

  const getDashboardTitle = async () => {
    try {
      const data = await dashboardsService.getDashboardsDetail(dashboardId)
      setDashboardTitle(data.title)
    } catch (error) {
      console.error('대시보드 정보 불러오기 실패:', error)
    }
  }
  const getDashboardMembers = async () => {
    try {
      const data = await membersService.getMembers(1, 20, dashboardId)

      setMembers(data.members)
    } catch (error) {
      console.error('대시보드 정보 불러오기 실패:', error)
    }
  }

  const getColumns = async () => {
    const columnsData = await columnsService.getColumns(dashboardId)
    setColumns(columnsData.data)
  }

  useEffect(() => {
    if (!query.id) return
    if (isNaN(dashboardId)) {
      // 대시보드 ID가 유효하지 않으면 404 페이지로 리다이렉트
      push('/404')
    } else {
      getColumns()
      getDashboardMembers()
      getDashboardTitle()
    }
  }, [query.id, dashboardId, push])

  // 404 리다이렉트 구현 필요
  if (!dashboardId || isNaN(dashboardId)) return null

  //  dashboardId={1}> id로 받을 수 있게 나중에 바꿔주세요!(지금은 임시)
  return (
    <>
      {/* 컬럼 리스트 */}
      <div className="flex overflow-x-auto">
        {columns.map((column) => (
          <Column key={column.id} columnInfo={column} />
        ))}

        {/* 새로운 컬럼 추가하기 버튼 */}
        <div className="pt-[6.8rem] pl-[2.4rem]">
          <ButtonDashboard
            paddingHeight="pt-[2.4rem] pb-[2rem]"
            paddingWidth="px-[8.6rem]"
            gap="gap-[1.2rem]"
            className="box-border w-full rounded-[8px] border border-[var(--gray-D9D9D9)]"
            color="bg-white text-[#333236] text-2lg-bold"
            suffix={
              <Image
                src="/assets/icon/add-box.svg"
                alt="추가 아이콘"
                width={22}
                height={22}
              />
            }
          >
            새로운 컬럼 추가하기
          </ButtonDashboard>
        </div>
      </div>
    </>
  )
}

DashboardPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout pageType="dashboard">{page}</Layout>
}
