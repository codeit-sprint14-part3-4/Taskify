import styles from './homenavbar.module.css'
import Image from 'next/image'
import clsx from 'clsx'

import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import Badge from '@/components/common/badge/Badge'
import { useDashboardMembers } from '@/stores/dashboardMembers'
import { useAuthStore } from '@/stores/auth'
import Link from 'next/link'

interface HomeNavBarProps {
  pageType: 'mydashboard' | 'dashboard' | 'mypage'
  dashboardId: number
  dashboardTitle: string
  hasCrown: boolean
  onInviteClick: () => void
}

export default function HomeNavBar({
  dashboardId,
  pageType,
  dashboardTitle,
  hasCrown,
  onInviteClick,
}: HomeNavBarProps) {
  const { userData } = useAuthStore()
  const { members } = useDashboardMembers()

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
  const filteredMembers = Array.isArray(members)
    ? members.filter((member) => member.email !== userData?.email)
    : []
  const showCrown = pageType === 'mydashboard' && hasCrown
  const showDashboardControls = pageType !== 'mydashboard'

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
        {showDashboardControls && (
          <div
            className={clsx(
              styles.flex_center_space_between,
              styles.nav_right_center_border
            )}
          >
            {hasCrown && (
              <div className={styles.nav_right_center_border_setting}>
                <Link href={`/dashboard/${dashboardId}/edit`}>
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
                </Link>
              </div>
            )}
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
                    width={38}
                    height={38}
                    className={styles.icon}
                  />
                }
                onClick={onInviteClick}
              >
                초대하기
              </ButtonDashboard>
            </div>

            {/* 초대 멤버 프로필 */}
            <div className={styles.invited_members_wrapper}>
              {filteredMembers.slice(0, 4).map((member) => (
                <div key={member.email} className={styles.invited_profile}>
                  {member.profileImageUrl ? (
                    <Image
                      src={member.profileImageUrl}
                      alt={member.nickname}
                      width={296}
                      height={296}
                      style={{
                        width: '4rem',
                        height: '4rem',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        borderRadius: '50%',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <Badge nickname={member.nickname} />
                  )}
                </div>
              ))}

              {Array.isArray(members) && members.length > 4 && (
                <div className={styles.extra_count}>+{members.length - 4}</div>
              )}
            </div>
          </div>
        )}

        {/* 프로필 이미지 + 이름 */}
        <div
          className={clsx(styles.flex_center_space_between, styles.nav_right)}
        >
          <div className={styles.profile_image}>
            {userData?.profileImageUrl ? (
              <Image
                src={userData.profileImageUrl}
                alt="Profile Image"
                width={296}
                height={296}
                style={{
                  width: '4rem',
                  height: '4rem',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  borderRadius: '50%',
                  display: 'block',
                }}
              />
            ) : (
              <Badge nickname={userData ? userData.nickname : ''} />
            )}
          </div>
          <div
            className={`${styles.name} text-lg-medium`}
            style={{ marginLeft: '1.2rem' }}
          >
            {userData?.nickname}
          </div>
        </div>
      </div>
    </div>
  )
}
