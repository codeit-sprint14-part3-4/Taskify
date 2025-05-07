import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '@/pages/dashboard/[id]/dashboard.module.css'
import { columnsService } from '@/api/services/columnsServices'
import { cardsService } from '@/api/services/cardsServices'
import Layout from '@/components/layout/layout'
import Column from '@/components/domain/dashboard/Column'
import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import TaskCardCreateModal from '@/components/domain/modals/taskcardcreatemodal/TaskCardCreateModal'
import FormModal from '@/components/domain/modals/basemodal/FormModal'
import DeleteActionModal from '@/components/domain/modals/basemodal/DeleteActionModal'
import SkeletonDashboard from '@/components/skeleton/SkeletonDashboard'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import {
  ColumnType,
  CreateColumnBody,
  UpdateColumnBody,
} from '@/types/api/columns'

export default function DashboardPage() {
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [triggeredColumn, setTriggeredColumn] = useState<ColumnType | null>(
    null
  )
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isCardCreateModalOpen, setIsCardCreateModalOpen] = useState(false)
  const [isColumnCreateModal, setIsColumnCreateModal] = useState(false)
  const [isColumnEditModal, setIsColumnEditModal] = useState(false)
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false)
  const [columnModalError, setColumnModalError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedColumnId, setSelectedColumnId] = useState<number>(-1)
  const [columnModalInput, setColumnModalInput] = useState<string>('')
  const [isClient, setIsClient] = useState(false)

  const { query, push } = useRouter()
  const dashboardId = Number(query.id)

  const getColumns = async () => {
    const columnsData = await columnsService.getColumns(dashboardId)
    setColumns(columnsData.data)
    setIsLoading(false)
  }

  const isDuplicateColumnTitle = (title: string) => {
    return columns.some((column) => column.title === title.trim())
  }

  const handleCardCreateModalOpen = (columnId: number) => {
    setSelectedColumnId(columnId)
    setIsCardCreateModalOpen(true)
  }

  const handleCardCreateModalClose = () => setIsCardCreateModalOpen(false)

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
    setColumnModalError('')
  }

  const handleColumnOptionClick = (columnInfo: ColumnType) => {
    setTriggeredColumn(columnInfo)
    setColumnModalInput(columnInfo.title)
  }

  const handleDeleteColumnConfirm = (column: ColumnType) => {
    setTriggeredColumn(column)
    setIsDeleteConfirmModalOpen(true)
    setIsColumnEditModal(false)
  }

  const handleConfirmDelete = async () => {
    if (!triggeredColumn) return
    try {
      await columnsService.deleteColumns(triggeredColumn.id)
      setColumns(columns.filter((col) => col.id !== triggeredColumn.id))
      setTriggeredColumn(null)
      setIsDeleteConfirmModalOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  const postColumn = async () => {
    if (isDuplicateColumnTitle(columnModalInput)) {
      setColumnModalError('중복된 컬럼입니다')
      return
    }
    if (columnModalInput.trim() === '') {
      setColumnModalError('이름을 입력해주세요')
      return
    }
    try {
      const reqBody: CreateColumnBody = { title: columnModalInput, dashboardId }
      const res = await columnsService.postColumns(reqBody)
      setColumns([...columns, res])
      setIsColumnCreateModal(false)
      setColumnModalInput('')
      setColumnModalError('')
    } catch (err) {
      console.error(err)
    }
  }

  const putColumn = async (columnId: number) => {
    try {
      const reqBody: UpdateColumnBody = { title: columnModalInput }
      const res = await columnsService.putColumns(columnId, reqBody)
      setColumns(
        columns.map((col) =>
          col.id === columnId ? { ...col, title: res.title } : col
        )
      )
      handleColumnEditModal(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result
    if (!destination || source.droppableId === destination.droppableId) return
    try {
      // 1. 카드 상세 정보 가져오기
      const cardDetail = await cardsService.getCardsDetail(Number(draggableId))

      // 2. columnId만 변경해서 전체 정보와 함께 업데이트
      await cardsService.putCards(Number(draggableId), {
        title: cardDetail.title,
        description: cardDetail.description,
        tags: cardDetail.tags,
        columnId: Number(destination.droppableId), // ← 새 위치
      })

      setRefreshTrigger((prev) => prev + 1)
    } catch (err) {
      console.error('카드 이동 실패:', err)
    }
  }

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!query.id) return
    if (isNaN(dashboardId)) push('/404')
    else getColumns()
  }, [query.id, dashboardId])

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || !dashboardId || isNaN(dashboardId)) return null
  if (isLoading) return <SkeletonDashboard />

  const isCreateDisabled =
    columnModalInput.trim() === '' || isDuplicateColumnTitle(columnModalInput)

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.container}>
          {columns.map((column) => (
            <Column
              key={column.id}
              columnInfo={column}
              dashboardId={dashboardId}
              refreshTrigger={refreshTrigger}
              setRefreshTrigger={setRefreshTrigger}
              handleCardCreateModalOpen={handleCardCreateModalOpen}
              handleColumnEditModal={handleColumnEditModal}
              handleColumnOptionClick={handleColumnOptionClick}
              handleDeleteColumnConfirm={handleDeleteColumnConfirm}
            />
          ))}

          <div className={styles.addColumnWrapper}>
            <ButtonDashboard
              paddingHeight="pt-[2.4rem] pb-[2rem]"
              paddingWidth="px-[8.6rem]"
              gap="gap-[1.2rem]"
              className={styles.addColumnButton}
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
      </DragDropContext>

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
            setColumnModalError('')
          }}
          mode="default"
          size={isMobile ? 'small' : 'large'}
          errorMessage={columnModalError}
          isSubmitDisabled={isCreateDisabled}
        />
      )}

      {isColumnEditModal && triggeredColumn && !isDeleteConfirmModalOpen && (
        <FormModal
          title="컬럼 관리"
          inputLabel="이름"
          inputValue={columnModalInput}
          onChange={handleColumnModalInputChange}
          onEdit={() => putColumn(triggeredColumn.id)}
          onDelete={() => handleDeleteColumnConfirm(triggeredColumn)}
          onCancel={() => handleColumnEditModal(false)}
          cancelLabel="삭제"
          mode="delete"
          showCloseButton
          size={isMobile ? 'small' : 'large'}
        />
      )}

      {isDeleteConfirmModalOpen && triggeredColumn && (
        <DeleteActionModal
          message="컬럼의 모든 카드가 삭제됩니다"
          onCancel={() => {
            setIsDeleteConfirmModalOpen(false)
            setIsColumnEditModal(true)
          }}
          onDelete={handleConfirmDelete}
          size={isMobile ? 'small' : 'large'}
        />
      )}
    </>
  )
}

DashboardPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout pageType="dashboard">{page}</Layout>
}
