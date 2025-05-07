import styles from './editMyDashboardMember.module.css'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import Badge from '@/components/common/badge/Badge'
import { useState, useEffect } from 'react'
import { membersService } from '@/api/services/membersServices'
import { Member } from '@/types/api/menmbers'
import { useRouter } from 'next/router'
import Pagination from '@/components/common/commonbutton/Pagination'
import SkeletonMember from '@/components/skeleton/SkeletonMember'

export default function EditMyDashboardMember() {
  const router = useRouter()
  const id = Number(router.query.id)
  const [memberList, setMemberList] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const [showToast, setShowToast] = useState(false)
  const [falseToast, setFalseToast] = useState(false)
  const totalPages = Math.max(1, Math.ceil(totalCount / 5))



  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const memberData = await membersService.getMembers(currentPage, 5, id)
        setMemberList(memberData.members)
        setTotalCount(memberData.totalCount)
        setLoading(false)
      } catch (error) {
        console.error('멤버 데이터를 가져오는 중 오류 발생: ', error)
        setLoading(false)
      }
    }
    fetchMembers()
  }, [id, currentPage])

  const handleMemberDelete = async (memberId: number) => {
    try {
      await membersService.deleteMembers(memberId)
      setMemberList((prevMembers) =>
        prevMembers.filter((member) => member.id !== memberId)
      )
      //toast이용하면 좋을 것 같음  alert('취소 완료')
      alert('취소 완료')
      // setShowToast(true)
    } catch (error) {
      console.error('삭제를 실패했습니다.', error)
      alert('요청에 실패했습니다.')
      // setFalseToast(true)
    }
  }

  if (loading) {
    return <SkeletonMember />
  }
  return (
    <>
      <div className={styles.edit_member_container}>
        <div className={styles.edit_member_flex_container}>
          <div className={`${styles.edit_member_title} text-2xl-bold`}>
            구성원
          </div>
          <Pagination
            current={currentPage}
            total={totalPages}
            onPageChange={setCurrentPage}
          />
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
              isActive={true}
              className={`${styles.edit_delete_button} text-md-medium`}
              onClick={() => handleMemberDelete(member.id)}
            >
              삭제
            </CommonButton>
          </div>
        ))}

        {/* {showToast && (
          <Toast
            message="삭제되었습니다."
            onClose={() => setShowToast(false)}
            type="delete"
          />
        )} */}

        {/* {falseToast && (
          <Toast
            message="요청에 실패했습니다."
            onClose={() => setFalseToast(false)}
            type="info"
          />
        )} */}
      </div>
    </>
  )
}
