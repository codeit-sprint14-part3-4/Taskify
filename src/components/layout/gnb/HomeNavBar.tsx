import styles from './homenavbar.module.css'
import Image from 'next/image'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import Badge from '@/components/common/badge/Badge'
import { useDashboardMembers } from '@/stores/dashboardMembers'
import { useAuthStore } from '@/stores/auth'
import Link from 'next/link'

interface HomeNavBarProps {
  pageType: 'mydashboard' | 'dashboard' | 'mypage'
  dashboardId: number
  dashboardTitle: string
  isOwner: boolean
  isEditPage: boolean
  onInviteClick: () => void
}

export default function HomeNavBar({
  dashboardId,
  pageType,
  dashboardTitle,
  isOwner,
  isEditPage,
  onInviteClick,
}: HomeNavBarProps) {
  const { userData } = useAuthStore()
  const { members } = useDashboardMembers()
  const [membersToShow, setMembersToShow] = useState(4) // 반응형 지우지 마셈
  const getTitle = () => {
    switch (pageType) {
      case 'mydashboard':
        return '내 대시보드'
      case 'dashboard':
        return dashboardTitle
      case 'mypage':
        return '계정관리'
      default:
        return ''
    }
  }
  const filteredMembers = Array.isArray(members)
    ? members.filter((member) => member.email !== userData?.email)
    : []
  const showCrown = pageType === 'mydashboard' && isOwner
  const showDashboardControls =
    isOwner && pageType === 'dashboard' && !isEditPage

  // 반응형입니다.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1023) {
        setMembersToShow(2) // 모바일 화면에서 2명만 표시
      } else {
        setMembersToShow(4) // 화면이 크면 4명 표시
      }
    }

    // 화면 크기 초기 설정
    handleResize()
    window.addEventListener('resize', handleResize)

    // cleanup function
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return (
    <div className={styles.nav_wrapper}>
      {/* 왼쪽 영역: 제목 + 왕관 */}
      <div className={styles.nav_left}>
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
      <div className={clsx(styles.right_center_wrapper)}>
        {showDashboardControls && (
          <div className={styles.nav_right_center_border}>
            {isOwner && (
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
          </div>
        )}
        <div className={styles.nav_right_profile}>
          {/* 초대 멤버 프로필 */}
          <div className={styles.invited_members_wrapper}>
            {filteredMembers.slice(0, membersToShow).map((member) => (
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

            {Array.isArray(filteredMembers) &&
              filteredMembers.length > membersToShow && (
                <div className={styles.extra_count}>
                  +{filteredMembers.length - membersToShow}
                </div>
              )}
          </div>

          {/* 프로필 이미지 + 이름 */}
          <div className={styles.nav_right}>
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
    </div>
  )
}
