import React, { useState, useEffect, useRef, useCallback } from 'react'
import styles from './myInvitedDashboard.module.css'
import Image from 'next/image'

import CommonInput from '@/components/common/commoninput/CommonInput'
import CommonButton from '@/components/common/commonbutton/CommonButton'

import { invitationsService } from '@/api/services/invitationsServices'
import { useDashboardInvitations } from '@/stores/dashboardList'

const MyInvitedDashboard = () => {
  const { invitations, setInvitations, removeInvitation } =
    useDashboardInvitations()
  const [searchTerm, setSearchTerm] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // 초대 목록을 가져오는 함수
  const fetchInvitations = useCallback(
    async (cursorId?: number, title?: string, isNewSearch: boolean = false) => {
      if (isLoading || !hasMore) return
      setIsLoading(true)
      try {
        const search = title?.trim() === '' ? undefined : title
        const response = await invitationsService.getInvitations(
          10,
          cursorId,
          search
        )
        const newData = response.invitations

        setInvitations(isNewSearch ? newData : [...invitations, ...newData])
        setHasMore(newData.length === 10)
      } catch (error) {
        console.error('초대 목록 조회 실패:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [invitations, isLoading, hasMore, setInvitations]
  )

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setHasMore(true)
      fetchInvitations(undefined, searchTerm, true)
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [searchTerm, fetchInvitations])

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const lastItem = invitations[invitations.length - 1]
          if (lastItem) {
            fetchInvitations(lastItem.id, searchTerm)
          }
        }
      })

      if (node) observerRef.current.observe(node)
    },
    [invitations, hasMore, isLoading, searchTerm, fetchInvitations]
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleInviteAcceptButton = async (
    invitationId: number,
    isAccept: boolean
  ) => {
    try {
      await invitationsService.putInvitations(invitationId, {
        inviteAccepted: isAccept,
      })
      removeInvitation(invitationId) // 상태에서 초대 제거
    } catch (err) {
      console.error('초대 처리 실패:', err)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchdiv}>
        <h1 className={styles.inviteddashboardh1}>초대받은 대시보드</h1>
        <div className={styles.inputbox}>
          <CommonInput
            padding="0.7rem 0 0.7rem 4.8rem"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="검색"
            icon={
              <div className="ml-[1.6rem] p-[0.3rem]">
                <Image
                  src="assets/icon/searchicon.svg"
                  alt="검색 아이콘"
                  width={16}
                  height={16}
                />
              </div>
            }
            iconPosition="left"
          />
        </div>
      </div>
      <div className={styles.invitationbox}>
        {/* 헤더 */}
        <div className={styles.invitationtop}>
          <div>이름</div>
          <div>초대자</div>
          <div>수락 여부</div>
        </div>

        {/* 리스트 */}
        {invitations.map((item, index) => {
          const isLastItem = index === invitations.length - 1
          return (
            <div
              key={item.id}
              className={styles.invitationlist}
              ref={isLastItem ? lastItemRef : null}
            >
              <div>{item.dashboard.title}</div>
              <div>{item.inviter.nickname}</div>
              <div className={styles.buttonsction}>
                <CommonButton
                  padding="0.7rem 2.9rem"
                  isActive={true}
                  className={styles.customButtonSize}
                  onClick={() => handleInviteAcceptButton(item.id, true)}
                >
                  수락
                </CommonButton>
                <CommonButton
                  padding="0.7rem 2.9rem"
                  variant="secondary"
                  isActive={true}
                  onClick={() => handleInviteAcceptButton(item.id, false)}
                >
                  거절
                </CommonButton>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyInvitedDashboard
