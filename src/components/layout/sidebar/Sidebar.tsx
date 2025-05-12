import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './sidebar.module.css'
import DashboardCreateModal from '@/components/domain/modals/dashboardCreateModal/DashboardCreateModal'

import { useDashboardListStore } from '@/stores/dashboardList'

export default function Sidebar({
  currentDashboardId,
}: {
  currentDashboardId: number
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)

  const { sideBarDashboards, totalCount, fetchSidebarDashboards } =
    useDashboardListStore()

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handlePageMove = (direction: string) => {
    const lastPage = Math.ceil(totalCount / 12) // 마지막 페이지 계산
    if (direction === 'left' && page > 1) {
      setPage(page - 1) // 페이지 왼쪽으로 이동
    }
    if (direction === 'right' && page < lastPage) {
      setPage(page + 1) // 페이지 오른쪽으로 이동
    }
  }

  useEffect(() => {
    fetchSidebarDashboards(page) // page 인자를 넘겨서 페이지별로 12개씩 가져오기
  }, [page, fetchSidebarDashboards])

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
          {sideBarDashboards &&
            sideBarDashboards.map((dashboard) => (
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
          {page} / {Math.max(1, Math.ceil(totalCount / 12))}
        </div>
        <button
          disabled={page === Math.ceil(totalCount / 12) || totalCount === 0}
          className={`${styles.page_button} ${
            page === Math.ceil(totalCount / 12) || totalCount === 0
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
