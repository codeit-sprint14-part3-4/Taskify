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
  userName: string
  memberCount: number
  members: { email: string; name: string }[]
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
  // 제목 결정
  const getTitle = () => {
    switch (pageType) {
      case 'mydashboard':
        return '내 대시보드'
      case 'dashboard':
        return dashboardTitle || '대시보드 제목 없음'
      case 'mypage':
        return '계정관리'
      default:
        return ''
    }
  }

  // 왕관 아이콘 표시 여부
  const showCrown = pageType === 'mydashboard' && hasCrown

  // 초대 및 관리 버튼 등 표시 여부
  const showDashboardControls = pageType !== 'mydashboard'

  // 멤버 정보 텍스트
  const memberInfo =
    pageType === 'dashboard'
      ? Array.isArray(members) && members.length > 0
        ? `${members.length} 명`
        : '멤버 없음'
      : ''

  return (
    <div className={clsx(styles.flex_center_space_between, styles.nav_wrapper)}>
      {/* 왼쪽 영역: 제목 + 왕관 */}
      <div className={clsx(styles.flex_center_space_between, styles.nav_left)}>
        <div className={`${styles.dashboard_title} text-xl-bold`}>
          {getTitle()}
        </div>
        {showCrown && (
          <Image
            src="/assets/icon/crown.svg"
            alt="왕관"
            width={20}
            height={16}
          />
        )}
      </div>

      {/* 오른쪽 영역 */}
      <div className={clsx(styles.flex_center_space_between)}>
        {/* 설정 및 초대 버튼 등dd */}
        {showDashboardControls && (
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
                onClick={onInviteClick}
              >
                초대하기
              </ButtonDashboard>
            </div>
            <div className={styles.name_mark}>{memberInfo}</div>
          </div>
        )}

        {/* 프로필 이미지 + 이름 */}
        <div
          className={clsx(styles.flex_center_space_between, styles.nav_right)}
        >
          <div className={styles.profile_image}>
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile Image"
                width={40}
                height={40}
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
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
