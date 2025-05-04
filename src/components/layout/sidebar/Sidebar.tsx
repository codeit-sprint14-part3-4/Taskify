import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './sidebar.module.css'
import DashboardCreateModal from '@/components/domain/modals/dashboardCreateModal/DashboardCreateModal'

export default function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={styles.sidebar}>
      {/* 로고 영역 */}
      <Link href="/mydashboard" className={styles.logo}>
        {isLoading ? (
          <>
            <div className="w-[3rem] h-[3rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-full"></div>
            <div className="w-[8rem] h-[1.5rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-[0.4rem] mt-[0.4rem]"></div>
          </>
        ) : (
          <>
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
          </>
        )}
      </Link>

      {/* 메뉴 영역 */}
      <ul className={styles.menu}>
        <li className={styles.menuItem}>
          {isLoading ? (
            <div className="w-[10rem] h-[1.6rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-[0.4rem] mb-[1rem]"></div>
          ) : (
            <span className={styles.link}>Dash Boards</span>
          )}
          <button onClick={handleOpenModal} className={styles.addButton}>
            {isLoading ? (
              <div className="w-[2rem] h-[2rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-full"></div>
            ) : (
              <Image
                src="/assets/image/add-box.svg"
                alt="Add 추가 버튼"
                width={20}
                height={20}
              />
            )}
          </button>
        </li>
      </ul>

      {isModalOpen && <DashboardCreateModal onClose={handleCloseModal} />}
    </div>
  )
}
