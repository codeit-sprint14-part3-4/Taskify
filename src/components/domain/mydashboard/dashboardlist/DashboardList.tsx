import styles from './dashboardList.module.css'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import DashboardCreateModal from '@/components/domain/modals/dashboardCreateModal/DashboardCreateModal'
import DashBoardListButton from './DashboardListButton'
import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import ColorPin from '../../colorpin/ColorPin'
import { useDashboardListStore } from '@/stores/dashboardList'

export default function DashboardList() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { dashboards, totalCount, fetchDashboardList } = useDashboardListStore()

  // 페이지 변경 시 대시보드 목록 새로 가져오기
  useEffect(() => {
    fetchDashboardList(page).catch((err) => {
      const error = err as Error
      setError(error.message || '대시보드를 불러오는 데 실패했습니다.')
    })
  }, [page, fetchDashboardList])
  const handleNext = () => {
    const maxPage = Math.ceil(totalCount / 5) // 총 페이지 수 계산
    if (page < maxPage) {
      setPage((prev) => prev + 1) // 페이지가 최대 페이지보다 적을 경우에만 증가
    }
  }

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1) // 페이지가 1보다 크면 감소
    }
  }

  const handleDashboardClick = (id: number) => {
    router.push(`/dashboard/${id}`)
  }

  const handleCreateDashboardModal = () => setIsModalOpen(true)
  const handleCloseDashboardModal = () => setIsModalOpen(false)

  return (
    <div className={styles.wrapper}>
      <div className={styles.main_container}>
        <div className={styles.button_dashboard_wrapper}>
          <ButtonDashboard
            onClick={handleCreateDashboardModal}
            gap="gap-2"
            className="text-lg-semibold w-full md:w-full lg:py-[2.1rem] lg:px-[9.5rem] md:py-[2rem] md:px-[5.3rem] px-[7rem] py-[1.5rem] lg:w-full"
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
        </div>

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

        <span className={styles.page_number}>
          {page} / {Math.ceil(totalCount / 5)}{' '}
        </span>

        <button
          onClick={handleNext}
          disabled={page === totalCount}
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
