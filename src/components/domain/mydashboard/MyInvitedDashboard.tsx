import CommonInput from '@/components/common/input'
import styles from './myinviteddashboard.module.css'
import React, { useState } from 'react'
import Image from 'next/image'
import CommonButton from '@/components/common/commonbutton/CommonButton'

const data = [
  { name: '프로덕트 디자인', inviter: '손동희' },
  { name: '새로운 기획 문서', inviter: '유겨영' },
  { name: '유닛 A', inviter: '장혁' },
  { name: '유닛 B', inviter: '강나무' },
  { name: '유닛 C', inviter: '김태현' },
  { name: '유닛 D', inviter: '김태현' },
]

const MyInvitedDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<typeof data>([]) // ✅ 타입 수정

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value
    setSearchTerm(keyword)

    const results = data.filter((item) =>
      item.name.toLowerCase().includes(keyword.toLowerCase())
    )

    setFilteredData(results)
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
        {(searchTerm ? filteredData : data).map((item, index) => (
          <div key={index} className={styles.invitationlist}>
            <div>{item.name}</div>
            <div>{item.inviter}</div>
            <div className={styles.buttonsction}>
              <CommonButton
                padding="0.7rem 2.9rem"
                isActive={true}
                className={styles.customButtonSize}
              >
                수락
              </CommonButton>
              <CommonButton
                padding="0.7rem 2.9rem"
                variant="secondary"
                isActive={true}
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
