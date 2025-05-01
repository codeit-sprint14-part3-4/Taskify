import { useEffect, useState } from 'react'
import Image from 'next/image'
import Column from '@/components/domain/dashboard/Column' //
import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import Layout from '@/components/layout/layout'
import { columnsService } from '@/api/services/columnsServices'
import { ColumnType } from '@/types/api/columns'
import { useRouter } from 'next/router'

export default function DashboardPage() {
  const [columns, setColumns] = useState<ColumnType[]>([])

  const { query } = useRouter()
  const dashboardId = Number(query.id)

  const getColumns = async () => {
    const columnsData = await columnsService.getColumns(dashboardId)
    setColumns(columnsData.data)
  }

  useEffect(() => {
    if (!query.id) return
    getColumns()
  }, [query.id])

  // 404 리다이렉트 구현 필요
  if (!dashboardId) return

  //  dashboardId={1}> id로 받을 수 있게 나중에 바꿔주세요!(지금은 임시)
  return (
    <Layout pageType="dashboard" dashboardId={1}>
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
    </Layout>
  )
}
