import styles from './dashboardList.module.css'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import DashboardCreateModal from '@/components/domain/modals/dashboardCreateModal/DashboardCreateModal'
import { dashboardsService } from '@/api/services/dashboardsServices'
import DashBoardListButton from './DashboardListButton'
import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import ColorPin from '../../colorpin/ColorPin'

interface Dashboard {
  id: number
  title: string
  createdByMe: boolean
  color: string
}

export default function DashboardList() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const dashboardsPerPage = 5

  // 대시보드 목록을 가져오는 함수
  const fetchDashboards = async (pageNumber: number) => {
    try {
      const data = await dashboardsService.getDashboards(
        'pagination',
        pageNumber,
        dashboardsPerPage
      )
      setDashboards(data.dashboards)

      setTotalPages(Math.ceil(data.totalCount / dashboardsPerPage))
    } catch (err) {
      const error = err as Error
      setError(error.message || '대시보드를 불러오는 데 실패했습니다.')
    }
  }

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1)
  }

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1)
  }
  const handleDashboardClick = (id: number) => {
    router.push(`/dashboard/${id}`)
  }
  // 대시보드 생성 모달 열기 / 닫기
  const handleCreateDashboardModal = () => setIsModalOpen(true)
  const handleCloseDashboardModal = () => setIsModalOpen(false)

  useEffect(() => {
    fetchDashboards(page)
  }, [page])

  return (
    <div className={styles.wrapper}>
      <div className={styles.main_container}>
        <ButtonDashboard
          onClick={handleCreateDashboardModal}
          gap="gap-2"
          className="text-lg-semibold lg:py-[2.1rem] lg:px-[9.5rem] md:py-[2rem] md:px-[5.3rem] px-[7.5rem] py-[1.5rem] "
          suffix={
            <Image
              src="/assets/icon/add-box.svg"
              alt="addbutton"
              width={22}
              height={22}
              className="object-contain flex"
            />
          }
        >
          새로운 대시보드
        </ButtonDashboard>

        {error && <div className="text-red-500 mt-4">{error}</div>}

        {dashboards.map((dashboard, index) => (
          <DashBoardListButton
            onClick={() => handleDashboardClick(dashboard.id)}
            key={`${dashboard.id}-${dashboard.title}-${index}`}
            colorPin={
              <ColorPin
                id={dashboard.id}
                color={dashboard.color}
                isSelected={false}
                onClick={() => {}}
                width="0.8rem"
                height="0.8rem"
              />
            }
            suffix={
              dashboard.createdByMe && (
                <Image
                  src="/assets/icon/crown.svg"
                  alt="크라운"
                  width={16}
                  height={16}
                  className="object-contain"
                />
              )
            }
          >
            {dashboard.title}
          </DashBoardListButton>
        ))}
      </div>

      <div className={`${styles.page_wrapper} text-md-regular`}>
        <div className={styles.botton_gap}>
          <span>
            {page} / {totalPages}
          </span>
        </div>
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className={styles.page_button_left}
        >
          <div className={styles.crown_center}>
            <Image
              src="/assets/icon/arrow-left-gray.svg"
              alt="왼쪽페이지버튼"
              width={6}
              height={16}
              className="object-contain flex"
            />
          </div>
        </button>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className={styles.page_button_right}
        >
          <div className={styles.crown_center}>
            <Image
              src="/assets/icon/arrow-right-gray.svg"
              alt="오른쪽페이지버튼"
              width={6}
              height={16}
              className="object-contain flex"
            />
          </div>
        </button>
      </div>

      {isModalOpen && (
        <DashboardCreateModal onClose={handleCloseDashboardModal} />
      )}
    </div>
  )
}
