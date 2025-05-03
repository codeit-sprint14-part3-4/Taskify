import styles from './editMyDashboardMember.module.css'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import Image from 'next/image'
import ArrowLeft from '../../../../../public/assets/icon/arrow-left-gray.svg'
import ArrowRight from '../../../../../public/assets/icon/arrow-right-gray.svg'
import Badge from '@/components/common/badge/Badge'
import { useState, useEffect } from 'react'
import { membersService } from '@/api/services/membersServices'
import { Member } from '@/types/api/menmbers'
import { Dashboard } from '@/types/api/dashboards'
import { useRouter } from 'next/router'

export default function EditMyDashboardMember() {
  const router = useRouter()
  const id = Number(router.query.id)
  const [memberList, setMemberList] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const memberData = await membersService.getMembers(1, 20, id)
        console.log('멤버 호출 성공!: ', memberData)
        setMemberList(memberData.members)
        setLoading(false)
      } catch (error) {
        console.error('멤버 데이터를 가져오는 중 오류 발생: ', error)
        setLoading(false)
      }
    }
    fetchMembers()
  }, [id])

  const handleMemberDelete = async (memberId: number) => {
    try {
      await membersService.deleteMembers(memberId)
      console.log('삭제 완료', memberId)
      setMemberList((prevMembers) =>
        prevMembers.filter((member) => member.id !== memberId)
      )
    } catch (error) {
      console.error('삭제를 실패했습니다.', error)
    }
  }

  return (
    <>
      <div className={styles.edit_member_container}>
        <div className={styles.edit_member_flex_container}>
          <div className={`text-2xl-bold`}>구성원</div>
          <div className={styles.edit_member_flex_container}>
            <div>1 페이지 중 1</div>
            <div>
              <Image
                src={ArrowLeft}
                alt="왼쪽페이지버튼"
                width={20}
                height={16}
                className="object-contain flex"
              />
            </div>
            <div>
              <Image
                src={ArrowRight}
                alt="오른쪽페이지버튼"
                width={20}
                height={16}
                className="object-contain flex"
              />
            </div>
          </div>
        </div>
        <div className={`${styles.edit_member_name_header} text-lg-regular`}>
          이름
        </div>

        {memberList.map((member) => (
          <div key={member.id} className={styles.member_delete_container}>
            <div
              className={`${styles.edit_member_flex_container} ${styles.edit_member_flex_gap}`}
            >
              <Badge nickname={member.nickname || '닉네임없음'} />
              <div className={`${styles.edit_member_name} text-lg-regular`}>
                {member.nickname}
              </div>
            </div>

            <CommonButton
              variant="secondary"
              padding="0.4rem 2.95rem"
              isActive={true}
              className={`${styles.edit_delete_button} text-md-medium`}
              onClick={() => handleMemberDelete(member.id)}
            >
              삭제
            </CommonButton>
          </div>
        ))}
      </div>
    </>
  )
}
