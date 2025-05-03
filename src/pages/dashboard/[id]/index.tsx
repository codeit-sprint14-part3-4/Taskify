import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { columnsService } from '@/api/services/columnsServices'
import Layout from '@/components/layout/layout'
import Column from '@/components/domain/dashboard/Column'
import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import TaskCardCreateModal from '@/components/domain/modals/taskcardcreatemodal/TaskCardCreateModal'
import { ColumnType } from '@/types/api/columns'

export default function DashboardPage() {
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [isCardCreateModalOpen, setIsCardCreateModalOpen] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState<number>(-1)
  const { query, push } = useRouter()
  const dashboardId = Number(query.id)

  const getColumns = async () => {
    const columnsData = await columnsService.getColumns(dashboardId)
    setColumns(columnsData.data)
  }

  const handleCardCreateModalOpen = (columnId: number) => {
    setSelectedColumnId(columnId)
    setIsCardCreateModalOpen(true)
  }

  const handleCardCreateModalClose = () => {
    setIsCardCreateModalOpen(false)
  }
  const handleColumnFixModalOpen = (columnId: number) => {
    console.log('컬럼 수정 모달 열기:', columnId)
  }

  useEffect(() => {
    if (!query.id) return
    if (isNaN(dashboardId)) {
      push('/404')
    } else {
      getColumns()
    }
  }, [query.id, dashboardId, push])

  if (!dashboardId || isNaN(dashboardId)) return null

  return (
    <>
      <div className="flex overflow-x-auto">
        {columns.map((column) => (
          <Column
            key={column.id}
            columnInfo={column}
            handleCardCreateModalOpen={handleCardCreateModalOpen}
            handleColumnFixModalOpen={handleColumnFixModalOpen}
          />
        ))}
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
      {isCardCreateModalOpen && (
        <TaskCardCreateModal
          dashboardId={dashboardId}
          columnId={selectedColumnId}
          handleCardCreateModalClose={handleCardCreateModalClose}
        />
      )}
    </>
  )
}

DashboardPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout pageType="dashboard">{page}</Layout>
}
