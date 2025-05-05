import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './gnb.module.css'
import clsx from 'clsx'

import { dashboardsService } from '@/api/services/dashboardsServices'
import Badge from '@/components/common/badge/Badge' // Badge 컴포넌트를 임포트
import { useAuthStore } from '@/stores/auth'
import logo_taskify from '../../../../public/assets/image/logo-taskify.svg'
import text_taskify from '../../../../public/assets/image/text-taskify.svg'

const Gnb = () => {
  const { accessToken, userData } = useAuthStore()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [firstDashboardId, setFirstDashboardId] = useState<number | null>(null)

  // 로그인 상태 확인
  useEffect(() => {
    setIsLoggedIn(!!(accessToken && userData))
  }, [accessToken, userData])

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        if (accessToken) {
          const res = await dashboardsService.getDashboards('pagination', 1, 1)
          if (res.dashboards.length > 0) {
            setFirstDashboardId(res.dashboards[0].id)
          }
        }
      } catch (error) {
        console.error('대시보드 불러오기 실패:', error)
      }
    }

    fetchDashboard()
  }, [accessToken])

  return (
    <nav className={styles.nav}>
      <div className={styles.navWrapper}>
        <Link href={'/'} className={styles.logo}>
          <Image src={logo_taskify} alt="Logo" className={styles.image} />
          <Image src={text_taskify} alt="Text" className={styles.logotext} />
        </Link>

        <ul className={clsx(styles.login, 'text-lg-regular')}>
          {isLoggedIn ? (
            <>
              <li>
                <Link
                  href={
                    firstDashboardId ? `/dashboard/${firstDashboardId}` : '#'
                  }
                >
                  대시보드로 이동
                </Link>
              </li>
              <li className={styles.profile}>
                <Badge
                  nickname={userData?.nickname || ''}
                  profileImage={userData?.profileImageUrl}
                />
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login">로그인</Link>
              </li>
              <li>
                <Link href="/signup">회원가입</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Gnb
