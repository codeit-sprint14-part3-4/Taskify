import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './sidebar.module.css'
import DashboardCreateModal from '@/components/domain/modals/dashboardCreateModal/DashboardCreateModal'

export default function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

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
      </ul>

      {isModalOpen && <DashboardCreateModal onClose={handleCloseModal} />}
    </div>
  )
}
