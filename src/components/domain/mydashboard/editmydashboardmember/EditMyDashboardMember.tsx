import styles from './editMyDashboardMember.module.css'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import Badge from '@/components/common/badge/Badge'
import { useState, useEffect } from 'react'
import { membersService } from '@/api/services/membersServices'
import { Member } from '@/types/api/menmbers'
import { useRouter } from 'next/router'
import Pagination from '@/components/common/commonbutton/Pagination'
import SkeletonMember from '@/components/skeleton/SkeletonMember'
import { useToast } from '@/context/ToastContext'

export default function EditMyDashboardMember() {
  const { showToast } = useToast()
  const router = useRouter()
  const id = Number(router.query.id)
  const [memberList, setMemberList] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
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
      showToast('성공적으로 완료되었습니다!', 'success')
    } catch (error) {
      showToast('에러가 발생했습니다.', 'error')
      console.error('삭제를 실패했습니다.', error)
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
      </div>
    </>
  )
}
