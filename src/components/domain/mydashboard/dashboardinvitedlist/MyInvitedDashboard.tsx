import CommonInput from '@/components/common/commoninput/CommonInput'
import styles from './myinviteddashboard.module.css'
import React, { useState } from 'react'
import Image from 'next/image'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import { Invitation } from '@/types/api/invitations'
import { invitationsService } from '@/api/services/invitationsServices'

interface MyInvitedDashboardProps {
  invitedList: Invitation[]
}

const MyInvitedDashboard = ({ invitedList }: MyInvitedDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<Invitation[]>([]) // ✅ 타입 수정

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value
    setSearchTerm(keyword)

    const results = invitedList.filter((item) =>
      item.dashboard.title.toLowerCase().includes(keyword.toLowerCase())
    )

    setFilteredData(results)
  }

  const handleInviteAcceptButton = async (
    invitationId: number,
    isAccept: boolean
  ) => {
    try {
      const bodyData = {
        inviteAccepted: isAccept ? true : false,
      }
      await invitationsService.putInvitations(invitationId, bodyData)
      console.log('응답 성공!!')
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

        {/* 데이터 목록 */}
        {(searchTerm ? filteredData : invitedList).map((item, index) => (
          <div key={index} className={styles.invitationlist}>
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
        ))}
      </div>
    </div>
  )
}

export default MyInvitedDashboard
