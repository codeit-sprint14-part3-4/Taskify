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

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handlePageMove = (direction: string) => {
    if (page !== 1 && direction === 'left') {
      setPage((prev) => prev - 1)
    }
    if (Math.ceil(totalCount / 10) !== page && direction === 'right') {
      setPage((prev) => prev + 1)
    }
  }

  const getDashboardList = async () => {
    try {
      const res = await dashboardsService.getDashboards('pagination', page)
      setDashboardList(res.dashboards)
      setTotalCount(res.totalCount)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getDashboardList()
  }, [page, currentDashboardId])

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

      {/* 페이지네이션 항상 표시 */}
      <article className={styles.article}>
        <button
          disabled={page === 1}
          className={`${styles.page_button} ${
            page === 1 ? styles.disabled : ''
          }`}
          onClick={() => handlePageMove('left')}
        >
          <Image
            className={styles.page_button_image}
            src="/assets/image/arrow-left-bold.svg"
            width={16}
            height={16}
            alt="왼쪽 화살표"
          />
        </button>
        <div className={styles.page_number}>
          {page} / {Math.max(1, Math.ceil(totalCount / 10))}
        </div>
        <button
          disabled={page === Math.ceil(totalCount / 10) || totalCount === 0}
          className={`${styles.page_button} ${
            page === Math.ceil(totalCount / 10) || totalCount === 0
              ? styles.disabled
              : ''
          }`}
          onClick={() => handlePageMove('right')}
        >
          <Image
            className={styles.page_button_image}
            src="/assets/image/arrow-right-bold.svg"
            width={16}
            height={16}
            alt="오른쪽 화살표"
          />
        </button>
      </article>

      {isModalOpen && <DashboardCreateModal onClose={handleCloseModal} />}
    </div>
  )
}
