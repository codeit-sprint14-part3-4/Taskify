import styles from './homenavbar.module.css'
import Image from 'next/image'
import clsx from 'clsx'

import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import Badge from '@/components/common/badge/Badge'

interface HomeNavBarProps {
  pageType: 'mydashboard' | 'dashboard' | 'mypage'
  dashboardId: number
  dashboardTitle: string
  hasCrown: boolean
  userName: string // userName을 추가
  memberCount: number
  members: { email: string; name: string }[] // members 추가
  onInviteClick: () => void
  profileImage?: string
}

export default function HomeNavBar({
  dashboardId,
  pageType,
  dashboardTitle,
  hasCrown,
  userName,
  memberCount,
  members,
  onInviteClick,
  profileImage,
}: HomeNavBarProps) {
  return (
    <div className={clsx(styles.flex_center_space_between, styles.nav_wrapper)}>
      <div className={clsx(styles.flex_center_space_between, styles.nav_left)}>
        <div className={`${styles.dashboard_title} text-xl-bold`}>
          {pageType === 'mydashboard' && '내 대시보드'}
          {pageType === 'dashboard' && (dashboardTitle || '대시보드 제목 없음')}
          {pageType === 'mypage' && '계정관리'}
        </div>
        {pageType === 'mydashboard' && hasCrown && (
          <Image
            src="/assets/icon/crown.svg"
            alt="왕관"
            width={20}
            height={16}
          />
        )}
      </div>

      <div className={clsx(styles.flex_center_space_between)}>
        {pageType !== 'mydashboard' && (
          <div
            className={clsx(
              styles.flex_center_space_between,
              styles.nav_right_center_border
            )}
          >
            <div className={styles.nav_right_center_border_setting}>
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
                    src="/assets/icon/settings-logo.svg"
                    alt="설정"
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
                    src="/assets/icon/add-box-gray.svg"
                    alt="초대 아이콘"
                    width={20}
                    height={20}
                    className={styles.icon}
                  />
                }
                onClick={onInviteClick} // 상위 컴포넌트로부터 전달받은 클릭 핸들러
              >
                초대하기
              </ButtonDashboard>
            </div>
            <div className={styles.name_mark}>
              {pageType === 'dashboard' && (
                <div>
                  {Array.isArray(members) && members.length > 0
                    ? `${members.length} 명`
                    : '멤버 없음'}
                </div>
              )}
            </div>
          </div>
        )}
        <div
          className={clsx(styles.flex_center_space_between, styles.nav_right)}
        >
          <div className={styles.profile_image}>
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile Image"
                width={40} // 고정된 너비
                height={40} // 고정된 높이
                style={{
                  objectFit: 'cover', // 이미지를 부모 div에 맞게 잘라서 꽉 채운다
                  objectPosition: 'center', // 이미지를 중앙으로 위치시킨다
                }}
              />
            ) : (
              <Badge nickname={userName} />
            )}
          </div>
          <div className={`${styles.name} text-lg-medium`}>{userName}</div>
        </div>
      </div>
    </div>
  )
}
