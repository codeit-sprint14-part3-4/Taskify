import styles from './homenavbar.module.css'
import ButtonDashboard from '@/components/common/button/ButtonDashboard'
import Image from 'next/image'

import clsx from 'clsx'
export default function HomeNavBar() {
  return (
    <div className={clsx(styles.flex_center_space_between, styles.nav_wrapper)}>
      <div className={clsx(styles.flex_center_space_between, styles.nav_left)}>
        <div className={styles.dashboard_title}>제목</div>
        <div>왕관(필수아님)</div>
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
              paddingHeight="py-2"
              paddingWidth="px-4"
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
              paddingHeight="py-2"
              paddingWidth="px-4"
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
          <div className={styles.nickname_tag}>몇명</div>
        </div>
        <div
          className={clsx(styles.flex_center_space_between, styles.nav_right)}
        >
          <div className={styles.name_mark}>마크</div>
          <div className={styles.name}>이름</div>
        </div>
      </div>
    </div>
  )
}
