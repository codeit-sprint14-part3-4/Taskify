import styles from './homenavbar.module.css'
import Image from 'next/image'
import clsx from 'clsx'

import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import Badge from '@/components/common/badge/Badge'
import { useDashboardInfo } from '@/hooks/useDashboardInfo'

export default function HomeNavBar({
  dashboardId,
  pageType,
}: {
  dashboardId: number
  pageType: 'mydashboard' | 'dashboard' | 'mypage'
}) {
  const { dashboardTitle, hasCrown, userName } = useDashboardInfo(
    dashboardId,
    pageType
  )

  return (
    <div className={clsx(styles.flex_center_space_between, styles.nav_wrapper)}>
      <div className={clsx(styles.flex_center_space_between, styles.nav_left)}>
        <div className={`${styles.dashboard_title} text-xl-bold`}>
          {pageType === 'mydashboard' && '내 대시보드'}
          {pageType === 'dashboard' && (dashboardTitle || '대시보드 제목 없음')}
          {pageType === 'mypage' && '계정관리'}
        </div>
        <div>
          {pageType === 'mydashboard' && hasCrown && (
            <Image
              src="/assets/icon/crown.svg"
              alt="왕관"
              width={20}
              height={16}
            />
          )}
        </div>
      </div>
      <div className={styles.flex_center_space_between}>
        <div
          className={clsx(
            styles.flex_center_space_between,
            styles.nav_right_center_border
          )}
        >
          <div className={styles.nav_right_center_border}>
            <ButtonDashboard
              paddingHeight="py-3"
              paddingWidth="px-6.5"
              gap="gap-2"
              style={{
                color: 'var(--gray-787486)',
                objectFit: 'contain',
                display: 'flex',
              }}
              prefix={
                <Image
                  src="/assets/icon/settings_logo.svg"
                  alt="addbutton"
                  width={20}
                  height={20}
                  className={styles.icon}
                />
              }
            >
              관리
            </ButtonDashboard>
          </div>
          <div className={styles.button_invitation}>
            <ButtonDashboard
              paddingHeight="py-3"
              paddingWidth="px-6.5"
              gap="gap-2"
              style={{
                color: 'var(--gray-787486)',
                objectFit: 'contain',
                display: 'flex',
              }}
              prefix={
                <Image
                  src="/assets/icon/add_box_gray.svg"
                  alt="addbutton"
                  width={20}
                  height={20}
                  className={styles.icon}
                />
              }
            >
              초대하기
            </ButtonDashboard>
          </div>
          <div className={styles.name_mark}>
            {pageType === 'dashboard' && <div>명</div>}
          </div>
        </div>
        <div
          className={clsx(styles.flex_center_space_between, styles.nav_right)}
        >
          {userName && <Badge nickname={userName} />}
          <div className={`${styles.name} text-lg-medium`}>{userName}</div>
        </div>
      </div>
    </div>
  )
}
