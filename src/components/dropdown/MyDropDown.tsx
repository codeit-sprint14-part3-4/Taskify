import React from 'react'
import styles from './myDropdown.module.css'
import { useRouter } from 'next/router'
import { useAuthStore } from '@/stores/auth'

const DropdownMenu = ({ onClose }: { onClose?: () => void }) => {
  const router = useRouter()
  const { clearAuth } = useAuthStore() // 로그아웃

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
    onClose?.()
  }

  const handleProfile = () => {
    router.push('/mypage')
    onClose?.()
  }

  const handleDashboard = () => {
    router.push('/mydashboard')
    onClose?.()
  }

  return (
    <div className={styles.dropdownMenu}>
      <button onClick={handleDashboard}>내 대시보드</button>
      <button onClick={handleProfile}>내 정보</button>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  )
}

export default DropdownMenu
