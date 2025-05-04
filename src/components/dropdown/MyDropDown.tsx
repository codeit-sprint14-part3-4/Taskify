import React from 'react'
import styles from './myDropdown.module.css'
import { useRouter } from 'next/router'
import { useAuthStore } from '@/stores/auth'
import clsx from 'clsx'

const DropdownMenu = ({ onClose }: { onClose?: () => void }) => {
  const router = useRouter()
  const { clearAuth } = useAuthStore()

  const menuItems = [
    {
      label: '내 대시보드',
      onClick: () => {
        router.push('/mydashboard')
        onClose?.()
      },
    },
    {
      label: '내 정보',
      onClick: () => {
        router.push('/mypage')
        onClose?.()
      },
    },
    {
      label: '로그아웃',
      onClick: () => {
        clearAuth()
        router.push('/login')
        onClose?.()
      },
    },
  ]

  return (
    <div className={styles.dropdownMenu} role="menu" aria-label="사용자 메뉴">
      <div className={styles.menuHeader}>
        {menuItems.map(({ label, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={clsx`${styles.menuItem} text-md-regular`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default DropdownMenu
