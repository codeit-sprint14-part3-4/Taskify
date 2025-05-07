import styles from './homenavbar.module.css'
import Image from 'next/image'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

import DropdownPortal from '@/components/dropdown/DropdownPortal'
import MyDroopdown from '@/components/dropdown/MyDropDown'
import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import Badge from '@/components/common/badge/Badge'

import { useDashboardMembers } from '@/stores/dashboardMembers'
import { useAuthStore } from '@/stores/auth'

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
  const [membersToShow, setMembersToShow] = useState(4)
  // 드롭다운
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownBtnRef = useRef<HTMLDivElement>(null)

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

  const showCrown = pageType === 'dashboard' && isOwner
  const showDashboardControls =
    isOwner && pageType === 'dashboard' && !isEditPage

  useEffect(() => {
    const handleResize = () => {
      setMembersToShow(window.innerWidth <= 1023 ? 2 : 4)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  // 드롭다운
  useEffect(() => {
    const updateDropdownPosition = () => {
      //버튼 DOM 요소가 없으면 리턴 (안정성 체크)
      if (!dropdownBtnRef.current) return
      //드롭다운 버튼의 화면크기와 위치를 가져옵니다.
      const rect = dropdownBtnRef.current.getBoundingClientRect()
      // 버튼의 바로 아래 위치에 드롭다운 뜨게 style 설정
      setDropdownStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY + 8,
        left:
          window.innerWidth <= 787
            ? rect.left + window.scrollX - 100 // 모바일에서는 더 왼쪽
            : rect.left + window.scrollX + 30, // 데스크탑 위치
        zIndex: 1000,
      })
    }
    // 화면 크기 바뀌거나 스크롤하면 위치 다시 계산해서 드롭다운이 항상 버튼 아래 잘 위치하도록 함
    if (dropdownOpen) {
      updateDropdownPosition()
      window.addEventListener('resize', updateDropdownPosition)
      window.addEventListener('scroll', updateDropdownPosition)
      //
      return () => {
        window.removeEventListener('resize', updateDropdownPosition)
        window.removeEventListener('scroll', updateDropdownPosition)
      }
    }
    //dropdownOpen이 바뀔 때 실행
  }, [dropdownOpen])
  return (
    <div className={styles.nav_wrapper}>
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

      <div className={clsx(styles.right_center_wrapper)}>
        {showDashboardControls && (
          <div className={styles.nav_right_center_border}>
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
            {filteredMembers.length > membersToShow && (
              <div className={styles.extra_count}>
                +{filteredMembers.length - membersToShow}
              </div>
            )}
          </div>

          {/* 프로필 이미지 + 이름 + 드롭다운 */}
          <div className={styles.nav_right}>
            <div
              ref={dropdownBtnRef}
              className={styles.profile_image}
              onClick={() => setDropdownOpen((prev) => !prev)}
              style={{ cursor: 'pointer' }}
            >
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
                <Badge nickname={userData?.nickname || ''} />
              )}
            </div>
            <div>
              {dropdownOpen && (
                <DropdownPortal>
                  <div
                    className={styles.dropdown}
                    style={dropdownStyle}
                    ref={dropdownRef}
                  >
                    <MyDroopdown onClose={() => setDropdownOpen(false)} />
                  </div>
                </DropdownPortal>
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
