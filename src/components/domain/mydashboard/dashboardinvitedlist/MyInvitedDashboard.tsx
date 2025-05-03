import React, { useState, useEffect, useRef, useCallback } from 'react'
import styles from './myInvitedDashboard.module.css'
import Image from 'next/image'
import CommonInput from '@/components/common/commoninput/CommonInput'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import { Invitation } from '@/types/api/invitations'
import { invitationsService } from '@/api/services/invitationsServices'

const MyInvitedDashboard = () => {
  const [invitedList, setInvitedList] = useState<Invitation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // 초대 목록을 가져오는 함수
  const fetchInvitations = useCallback(
    async (cursorId?: number) => {
      if (isLoading || !hasMore) return
      setIsLoading(true)

      // 9999를 한 이유는 초대 목록 검색을 위해서입니다.
      try {
        const response = await invitationsService.getInvitations(
          99999,
          cursorId
        )
        const newData = response.invitations
        console.log('초대 목록:', newData)
        setInvitedList((prev) => [...prev, ...newData])
        setHasMore(newData.length === 10)
      } catch (error) {
        console.error('초대 목록 조회 실패:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, hasMore]
  )
  // 처음 렌더링 시 초대 목록을 가져오는 useEffect
  useEffect(() => {
    fetchInvitations()
  }, [])

  // 스크롤 시 마지막 아이템을 감지하는 IntersectionObserver
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const lastItem = invitedList[invitedList.length - 1]
          if (lastItem) {
            fetchInvitations(lastItem.id)
          }
        }
      })

      if (node) observerRef.current.observe(node)
    },
    [invitedList, hasMore, isLoading]
  )

  // 검색어에 따라 초대 목록을 필터링
  const filteredData = searchTerm
    ? invitedList
        .filter((item) =>
          item.dashboard.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .reverse()
    : invitedList

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
      window.location.reload()
    } catch (err) {
      console.error(err)
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
        {filteredData.map((item, index) => {
          const isLastItem = index === filteredData.length - 1
          return (
            <div
              key={item.id}
              className={styles.invitationlist}
              ref={isLastItem && !searchTerm ? lastItemRef : null}
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
        <div style={{ height: '20px' }} />
        {isLoading && <p className="text-center mt-4">불러오는 중...</p>}
      </div>
    </div>
  )
}

export default MyInvitedDashboard
