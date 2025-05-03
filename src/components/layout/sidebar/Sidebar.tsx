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

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const getDashboardList = async () => {
    try {
      const res = await dashboardsService.getDashboards('infiniteScroll')
      setDashboardList(res.dashboards)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getDashboardList()
  }, [])

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
      <ul></ul>

      {isModalOpen && <DashboardCreateModal onClose={handleCloseModal} />}
    </div>
  )
}
