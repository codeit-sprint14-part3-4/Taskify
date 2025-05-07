import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import styles from './sidebar.module.css'
import DashboardCreateModal from '@/components/domain/modals/dashboardCreateModal/DashboardCreateModal'
import { Dashboard } from '@/types/api/dashboards'
import { dashboardsService } from '@/api/services/dashboardsServices'

export default function Sidebar({
  currentDashboardId,
}: {
  currentDashboardId: number
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dashboardList, setDashboardList] = useState<Dashboard[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handlePageMove = (direction: string) => {
    if (page !== 1 && direction == 'left') {
      setPage((prev) => prev - 1)
    }
    if (Math.ceil(totalCount / 10) !== page && direction == 'right') {
      setPage((prev) => prev + 1)
    }
  }

  const getDashboardList = async () => {
    setIsLoading(true)
    try {
      setIsLoading(true)
      const res = await dashboardsService.getDashboards('pagination', page)
      setDashboardList(res.dashboards)
      setTotalCount(res.totalCount)
      setIsLoading(false)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getDashboardList()
  }, [page, currentDashboardId])

  if (isLoading) {
    return (
      <div className={styles.sidebar}>
        {/* 로고 영역 */}
        <div className="flex flex-col items-center mb-[2rem]">
          <div className="w-[3rem] h-[3rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-full mb-[0.4rem]"></div>
          <div className="w-[8rem] h-[1.5rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-[0.4rem]"></div>
        </div>

        {/* 제목 영역 */}
        <div className="flex justify-between items-center px-[1rem] mb-[1rem]">
          <div className="w-[10rem] h-[1.6rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-[0.4rem]"></div>
          <div className="w-[2rem] h-[2rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-full"></div>
        </div>

        {/* 리스트 영역 */}
        <ul className="px-[1rem]">
          {Array.from({ length: 6 }).map((_, i) => (
            <li
              key={i}
              className="w-full h-[3rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-[0.4rem] mb-[0.5rem]"
            />
          ))}
        </ul>

        {/* 페이지네이션 영역 */}
        <article className="w-full flex justify-between items-center mt-[32px] px-[1rem]">
          <div className="w-[40px] h-[40px] bg-[var(--gray-D9D9D9)] animate-pulse rounded-full" />
          <div className="w-[3rem] h-[1.5rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-[0.4rem]" />
          <div className="w-[40px] h-[40px] bg-[var(--gray-D9D9D9)] animate-pulse rounded-full" />
        </article>
      </div>
    )
  }

  return (
    <div className={styles.sidebar}>
      <Link href="/mydashboard" className={styles.logo}>
        <Image
          src="/assets/icon/logo-icon.svg"
          alt="Taskify Icon"
          className={styles.logoIcon}
          width={30}
          height={30}
        />
        <Image
          src="/assets/icon/logo-title.svg"
          alt="Taskify Title"
          className={styles.logoTitle}
          width={80}
          height={24}
        />
      </Link>

      <ul className={styles.menu}>
        <li className={styles.menuItem}>
          <span className={styles.link}>Dash Boards</span>
          <button onClick={handleOpenModal} className={styles.addButton}>
            <Image
              src="/assets/image/add-box.svg"
              alt="Add 추가 버튼"
              width={20}
              height={20}
            />
          </button>
        </li>
        <ul className={styles.subMenu}>
          {dashboardList &&
            dashboardList.map((dashboard) => (
              <li className={styles.dashboard_list_dot} key={dashboard.id}>
                <Link
                  className={`${styles.dashboard_list} ${
                    currentDashboardId === dashboard.id
                      ? styles.dashboard_list_active
                      : ''
                  }`}
                  href={`/dashboard/${dashboard.id}`}
                >
                  <div
                    className={styles.colorDot}
                    style={{ backgroundColor: dashboard.color }}
                  ></div>
                  <div className={styles.dashboard_container}>
                    <div className={styles.dashboard_label}>
                      {dashboard.title}
                    </div>
                    {dashboard.createdByMe && (
                      <Image
                        src="/assets/icon/crown.svg"
                        alt="왕관"
                        width={20}
                        height={16}
                      />
                    )}
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      </ul>
      {dashboardList.length ? (
        <article className="w-full flex justify-between items-center mt-[32px]">
          <button
            className="w-[40px] h-[40px] border-2 border-[#D9D9D9] rounded-l-[6px] flex justify-center items-center cursor-pointer"
            onClick={() => handlePageMove('left')}
          >
            <Image
              className="w-[16px] h-[16px]"
              src="/assets/icon/arrow-left-gray.svg"
              width={16}
              height={16}
              alt="왼쪽 화살표"
            />
          </button>
          <div>
            {page} / {Math.ceil(totalCount / 10)}
          </div>
          <button
            className="w-[40px] h-[40px] border-2 border-[#D9D9D9] rounded-r-[6px] flex justify-center items-center cursor-pointer"
            onClick={() => handlePageMove('right')}
          >
            <Image
              className="w-[16px] h-[16px]"
              src="/assets/icon/arrow-right-gray.svg"
              width={16}
              height={16}
              alt="오른쪽 화살표"
            />
          </button>
        </article>
      ) : null}

      {isModalOpen && <DashboardCreateModal onClose={handleCloseModal} />}
    </div>
  )
}
