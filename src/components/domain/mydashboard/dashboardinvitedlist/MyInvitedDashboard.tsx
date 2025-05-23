import React, { useState, useEffect, useRef, useCallback } from 'react'
import styles from './myInvitedDashboard.module.css'
import Image from 'next/image'
import CommonInput from '@/components/common/commoninput/CommonInput'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import { Invitation } from '@/types/api/invitations'
import { invitationsService } from '@/api/services/invitationsServices'
import useIsMobile from '@/hooks/useIsMobile'

import { useDashboardListStore } from '@/stores/dashboardList'

import { useToast } from '@/context/ToastContext'


const MyInvitedDashboard = () => {
  const { showToast } = useToast()
  const [invitedList, setInvitedList] = useState<Invitation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isMobile = useIsMobile()

  // 초대 목록을 가져오는 함수
  const fetchInvitations = useCallback(
    async (cursorId?: number, title?: string, isNewSearch: boolean = false) => {
      if (isLoading || !hasMore) return
      setIsLoading(true)
      // '' 인 경우 undefined로 처리하여 검색어를 없애고, 검색어가 있는 경우 title을 사용합니다.
      try {
        const search = title?.trim() === '' ? undefined : title
        const response = await invitationsService.getInvitations(
          10,
          cursorId,
          search
        )
        const newData = response.invitations

        setInvitedList((prev) =>
          isNewSearch ? newData : [...prev, ...newData]
        )
        setHasMore(newData.length === 10)
      } catch (error) {
        console.error('초대 목록 조회 실패:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, hasMore]
  )

  // 검색하는 동안 초대 목록을 초기화하고 검색어에 따라 초대 목록을 가져오는  useEffect입나더
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setInvitedList([])
      setHasMore(true)
      fetchInvitations(undefined, searchTerm, true)
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [searchTerm])

  // 스크롤 시 마지막 아이템을 감지하는 IntersectionObserver
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            const lastItem = invitedList[invitedList.length - 1]
            if (lastItem) {
              fetchInvitations(lastItem.id, searchTerm)
            }
          }
        },
        {
          root: containerRef.current, // 내부 스크롤 컨테이너
          threshold: 0.1,
          rootMargin: '0px 0px 100px 0px',
        }
      )

      if (node) observerRef.current.observe(node)
    },

    [invitedList, hasMore, isLoading, searchTerm, fetchInvitations]
  )

  // 검색어 입력 핸들러
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }
  //  초대 수락/거절 버튼 핸들러
  const handleInviteAcceptButton = async (
    invitationId: number,
    isAccept: boolean
  ) => {
    try {
      await invitationsService.putInvitations(invitationId, {
        inviteAccepted: isAccept,
      })

      // ✅ 사이드바 갱신
      const fetchDashboardList =
        useDashboardListStore.getState().fetchDashboardList
      await fetchDashboardList(1)

      setInvitedList((prev) => prev.filter((item) => item.id !== invitationId))
      showToast('성공적으로 완료되었습니다!', 'success')
    } catch (error) {
      const err = error as Error
      showToast(err.message, 'error')
      console.error('초대 에러:', error)
    }
  }

  return (
    <div className={styles.wrapper} ref={containerRef}>
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
      {isMobile ? (
        <>
          {invitedList.map((item) => (
            <div key={item.id} className={styles.invitationMobileRow}>
              <div className={styles.Mobilelabel}>이름</div>
              <div className={styles.Mobilevalue}>{item.dashboard.title}</div>
              <div className={styles.Mobilelabel}>초대자</div>
              <div className={styles.Mobilevalue}>{item.inviter.nickname}</div>
              <div className={styles.hideOnMobile}>수락 여부</div>
              <div className={styles.Mobilevalue}>
                <div className={styles.buttonsction}>
                  <CommonButton
                    padding="0.7rem 3.7rem"
                    isActive={true}
                    onClick={() => handleInviteAcceptButton(item.id, true)}
                  >
                    수락
                  </CommonButton>
                  <CommonButton
                    padding="0.7rem 3.7rem"
                    variant="secondary"
                    isActive={true}
                    onClick={() => handleInviteAcceptButton(item.id, false)}
                  >
                    거절
                  </CommonButton>
                </div>
              </div>
            </div>
          ))}

          {/* ✅ 무한스크롤 트리거용 감지 엘리먼트 */}
          <div ref={lastItemRef} className={styles.infiniteTrigger} />
        </>
      ) : (
        // ✅ 기존 PC/태블릿용 구조
        <div className={styles.invitationbox}>
          {/* 헤더 */}
          <div className={styles.invitationtop}>
            <div>이름</div>
            <div>초대자</div>
            <div>수락 여부</div>
          </div>

          {/* 리스트 */}
          {invitedList.map((item, index) => {
            const isLastItem = index === invitedList.length - 1
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
                    padding=" 0.6rem 2.2rem"
                    isActive={true}
                    onClick={() => handleInviteAcceptButton(item.id, true)}
                  >
                    수락
                  </CommonButton>
                  <CommonButton
                    padding=" 0.6rem 2.2rem"
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
      )}
    </div>
  )
}

export default MyInvitedDashboard
