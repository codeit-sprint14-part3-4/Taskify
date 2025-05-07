import styles from './editMyDashboardInviteLog.module.css'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import Image from 'next/image'
import AddBox from '../../../../../public/assets/icon/add-box.svg'
import { useState, useEffect } from 'react'
import { dashboardsService } from '@/api/services/dashboardsServices'
import { Invitation } from '@/types/api/dashboards'
import FormModal from '../../modals/basemodal/FormModal'
import { useRouter } from 'next/router'
import Pagination from '@/components/common/commonbutton/Pagination'
import SkeletonInviteLog from '@/components/skeleton/SkeletonInviteLog'

export default function EditMyDashboardInviteLog() {
  const router = useRouter()
  const id = Number(router.query.id)
  const [invitationList, setinvitationList] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const handleInvite = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    const fetchInviteEmail = async () => {
      try {
        const inviteEmailData =
          await dashboardsService.getDashboardsInvitations(id, currentPage, 5)
        setinvitationList(inviteEmailData.invitations)
        setTotalCount(inviteEmailData.totalCount)
        setLoading(false)
      } catch (error) {
        console.error('이메일 정보를 불러오지 못했습니다', error)
        setLoading(false)
      }
    }
    fetchInviteEmail()
  }, [id, currentPage])

  const handleConfirm = async () => {
    if (!inputValue) {
      setError('항목 이름을 입력하세요.')
      return
    }

    const body = {
      email: inputValue,
    }

    try {
      const res = await dashboardsService.postDashboardsInvitations(id, body)
      setinvitationList((prev) => [...prev, res])
      setError('')
      setInputValue('')
      //toast 이용 alert('초대 신청이 완료됐어요.')
      alert('초대 신청이 완료됐어요.')
      // setInviteToast(true)
      setIsModalOpen(false)
    } catch (error) {
      console.error('초대 버튼에서 에러가 발생했습니다. ', error)
      alert('요청에 실패했습니다.')
      // setFalseToast(true)
    }
  }

  const handleInviteCancle = async (invitationId: number) => {
    try {
      await dashboardsService.deleteDashboardsInvitations(id, invitationId)
      // toast 이용 alert('취소 완료')
      alert('취소 완료')
      // setCancelToast(true)
      setinvitationList((prev) =>
        prev.filter((email) => email.id !== invitationId)
      )
    } catch (error) {
      alert('요청에 실패했습니다.')
      console.error('초대 거절 에러가 발생했습니다. ', error)
    }
  }

  if (loading) {
    return <SkeletonInviteLog />
  }

  return (
    <>
      <div className={styles.edit_invite_container}>
        <div className={styles.edit_invite_header_flex_container}>
          <div className={`${styles.edit_invite_title} text-2xl-bold`}>
            초대 내역
          </div>
          <div
            className={`${styles.edit_invite_header_flex_container} ${styles.edit_intite_button_pagination_container}`}
          >
            <div className={styles.pagination_container}>
              <Pagination
                current={currentPage}
                total={Math.ceil(totalCount / 5)}
                onPageChange={setCurrentPage}
              />
            </div>
            <div className={styles.button_container}>
              <CommonButton
                variant="primary"
                isActive={true}
                className={`${styles.button_hover} ${styles.invite_button} text-md-medium`}
                onClick={() => handleInvite()}
              >
                <Image
                  src={AddBox}
                  alt="초대하기 버튼"
                  width={16}
                  height={16}
                  className="object-contain"
                />
                초대하기
              </CommonButton>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <FormModal
            size="large"
            title="초대하기"
            inputLabel="이메일"
            inputValue={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onCreate={handleConfirm}
            onCancel={handleCancel}
            errorMessage={error}
            cancelLabel="취소"
            mode="default"
          />
        )}

        <div
          className={`${styles.edit_invite_email_header} ${styles.invite_mobile_button} text-lg-regular`}
        >
          이메일
          <div className={styles.change_mobile_button_container}>
            <CommonButton
              variant="primary"
              isActive={true}
              className={`${styles.button_hover} ${styles.invite_button} text-md-medium`}
              onClick={() => handleInvite()}
            >
              <Image
                src={AddBox}
                alt="초대하기 버튼"
                width={16}
                height={16}
                className="object-contain"
              />
              초대하기
            </CommonButton>
          </div>
        </div>

        {invitationList.map((invitations) => (
          <div key={invitations.id} className={styles.invite_cancle_container}>
            <div>
              <div className={`${styles.edit_invite_email} text-lg-regular`}>
                {invitations.invitee.email}
              </div>
            </div>
            <CommonButton
              variant="secondary"
              isActive={true}
              className={`${styles.edit_cancel_button} text-md-medium`}
              onClick={() => handleInviteCancle(invitations.id)}
            >
              취소
            </CommonButton>
          </div>
        ))}

        {/* {cancelToast && (
          <Toast
            message="삭제되었습니다."
            onClose={() => setCancelToast(false)}
            type="delete"
          />
        )} */}

        {/* {inviteToast && (
          <Toast
            message="초대가 완료되었습니다."
            onClose={() => setInviteToast(false)}
            type="success"
          />
        )}

        {falseToast && (
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
