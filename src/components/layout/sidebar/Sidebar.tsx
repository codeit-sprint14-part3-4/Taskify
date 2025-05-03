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
    if (page !== 1 && direction == 'left') {
      setPage((prev) => prev - 1)
    }
    if (Math.ceil(totalCount / 10) !== page && direction == 'right') {
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
      {/* 로고 영역 */}
      <Link href="/" className={styles.logo}>
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

      {/* 메뉴 영역 */}
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
        <ul className="h-[580px]">
          {dashboardList &&
            dashboardList.length &&
            dashboardList.map((dashboard) => (
              <li key={dashboard.id}>
                <Link
                  className={`flex items-center gap-[16px] mb-[8px] px-[12px] py-[12px] rounded-[4px] ${
                    currentDashboardId === dashboard.id ? 'bg-[#F1EFFD]' : ''
                  }`}
                  href={`/dashboard/${dashboard.id}`}
                >
                  <div
                    className="w-[8px] h-[8px] rounded-full"
                    style={{ backgroundColor: dashboard.color }}
                  ></div>
                  <div className="flex items-center gap-[6px]">
                    <div className="text-2lg-medium text-[#787486]">
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
            alt="오른른쪽 화살표"
          />
        </button>
      </article>

      {isModalOpen && <DashboardCreateModal onClose={handleCloseModal} />}
    </div>
  )
}
