import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { columnsService } from '@/api/services/columnsServices'
import Layout from '@/components/layout/layout'
import Column from '@/components/domain/dashboard/Column'
import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import TaskCardCreateModal from '@/components/domain/modals/taskcardcreatemodal/TaskCardCreateModal'
import {
  ColumnType,
  CreateColumnBody,
  UpdateColumnBody,
} from '@/types/api/columns'
import FormModal from '@/components/domain/modals/basemodal/FormModal'

export default function DashboardPage() {
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [triggeredColumn, setTriggeredColumn] = useState<ColumnType | null>(
    null
  )
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0)

  const [isCardCreateModalOpen, setIsCardCreateModalOpen] = useState(false)
  const [isColumnCreateModal, setIsColumnCreateModal] = useState(false)
  const [isColumnEditModal, setIsColumnEditModal] = useState(false)

  const [selectedColumnId, setSelectedColumnId] = useState<number>(-1)
  const [columnModalInput, setColumnModalInput] = useState<string>('')
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

  const handleColumnCreateModal = (state: boolean) => {
    if (state && columns.length >= 10) {
      alert('컬럼은 최대 10개까지 추가가 가능합니다.')
      return
    }
    setIsColumnCreateModal(state)
  }

  const handleColumnEditModal = (state: boolean) => {
    if (state && triggeredColumn) setColumnModalInput(triggeredColumn.title)
    setIsColumnEditModal(state)
  }

  const handleColumnModalInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setColumnModalInput(e.target.value)
  }

  const handleColumnOptionClick = (columnInfo: ColumnType) => {
    setTriggeredColumn(columnInfo)
    setColumnModalInput(columnInfo.title)
  }

  const postColumn = async () => {
    try {
      const reqBody: CreateColumnBody = {
        title: columnModalInput,
        dashboardId: dashboardId,
      }
      const res = await columnsService.postColumns(reqBody)
      const result = [...columns, res]
      setColumns(result)
      setIsColumnCreateModal(false)
      setColumnModalInput('')
    } catch (err) {
      console.error(err)
    }
  }
  const putColumn = async (columnId: number) => {
    try {
      const reqBody: UpdateColumnBody = {
        title: columnModalInput,
      }
      const res = await columnsService.putColumns(columnId, reqBody)
      const result = [...columns].map((column) => {
        if (column.id === columnId) {
          column.title = res.title
        }
        return column
      })
      setColumns(result)
      // const result = [...columns, res]
      // setColumns(result)
      handleColumnEditModal(false)
    } catch (err) {
      console.error(err)
    }
  }

  const deleteColumn = async (columnId: number) => {
    try {
      await columnsService.deleteColumns(columnId)
      const result = columns.filter((column) => column.id !== columnId)
      setColumns(result)
      handleColumnEditModal(false)
      setColumnModalInput('')
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (!query.id) return
    if (isNaN(dashboardId)) {
      // 대시보드 ID가 유효하지 않으면 404 페이지로 리다이렉트
      push('/404')
    } else {
      getColumns()
    }
  }, [query.id, dashboardId, push])

  // 404 리다이렉트 구현 필요
  if (!dashboardId || isNaN(dashboardId)) return null

  return (
    <>
      {/* 컬럼 리스트 */}
      <div className="flex overflow-x-auto">
        {columns.map((column) => (
          <Column
            key={column.id}
            columnInfo={column}
            dashboardId={dashboardId}
            refreshTrigger={refreshTrigger}
            handleCardCreateModalOpen={handleCardCreateModalOpen}
            handleColumnEditModal={handleColumnEditModal}
            handleColumnOptionClick={handleColumnOptionClick}
          />
        ))}

        {/* 새로운 컬럼 추가하기 버튼 */}
        <div className="pt-[6.8rem] pl-[2.4rem]">
          <ButtonDashboard
            paddingHeight="pt-[2.4rem] pb-[2rem]"
            paddingWidth="px-[8.6rem]"
            gap="gap-[1.2rem]"
            className="box-border w-full rounded-[8px] border border-[var(--gray-D9D9D9)]"
            color="bg-white text-[#333236] text-2lg-bold"
            onClick={() => {
              handleColumnCreateModal(true)
              setColumnModalInput('')
            }}
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
          setRefreshTrigger={setRefreshTrigger}
        />
      )}
      {isColumnCreateModal && (
        <FormModal
          title="새 컬럼 생성"
          inputLabel="이름"
          inputValue={columnModalInput}
          onChange={handleColumnModalInputChange}
          onCreate={postColumn}
          onCancel={() => {
            handleColumnCreateModal(false)
            setColumnModalInput('')
          }}
          mode="default"
        />
      )}
      {isColumnEditModal && triggeredColumn && (
        <FormModal
          title="컬럼 관리"
          inputLabel="이름"
          inputValue={columnModalInput}
          onChange={handleColumnModalInputChange}
          onEdit={() => putColumn(triggeredColumn.id)}
          onDelete={() => deleteColumn(triggeredColumn.id)}
          onCancel={() => handleColumnEditModal(false)}
          cancelLabel="삭제"
          mode="delete"
          showCloseButton={true}
        />
      )}
    </>
  )
}

DashboardPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout pageType="dashboard">{page}</Layout>
}
