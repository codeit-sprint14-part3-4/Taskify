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
import { useToast } from '@/context/ToastContext'

export default function EditMyDashboardInviteLog() {
  const { showToast } = useToast()
  const router = useRouter()
  const id = Number(router.query.id)
  const [invitationList, setInvitationList] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const handleInvite = () => setIsModalOpen(true)
  const handleCancel = () => setIsModalOpen(false)

  const totalPages = Math.max(1, Math.ceil(totalCount / 5))

  useEffect(() => {
    const fetchInviteEmail = async () => {
      try {
        const inviteEmailData =
          await dashboardsService.getDashboardsInvitations(id, currentPage, 5)
        setInvitationList(inviteEmailData.invitations)
        setTotalCount(inviteEmailData.totalCount)
        setLoading(false)
      } catch (error) {
        console.error('이메일 정보를 불러오지 못했습니다', error)
        setLoading(false)
      }
    }
    if (id) fetchInviteEmail()
  }, [id, currentPage])

  const handleConfirm = async () => {
    if (!inputValue) {
      setError('항목 이름을 입력하세요.')
      return
    }
    const body = { email: inputValue }
    try {
      const res = await dashboardsService.postDashboardsInvitations(id, body)
      setInvitationList((prev) => [...prev, res])
      setError('')
      setInputValue('')
      showToast('성공적으로 완료되었습니다!', 'success')
      setIsModalOpen(false)
    } catch (error) {
      showToast('에러가 발생했습니다.', 'error')
      console.error('초대 버튼 에러:', error)
    }
  }

  const handleInviteCancel = async (invitationId: number) => {
    try {
      await dashboardsService.deleteDashboardsInvitations(id, invitationId)
      showToast('성공적으로 완료되었습니다!', 'success')
      setInvitationList((prev) =>
        prev.filter((email) => email.id !== invitationId)
      )
    } catch (error) {
      showToast('에러가 발생했습니다.', 'error')
      console.error('초대 취소 에러:', error)
    }
  }

  if (loading) {
    return <SkeletonInviteLog />
  }

  return (
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
              total={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
          <div className={styles.button_container}>
            <CommonButton
              variant="primary"
              isActive={true}
              className={`${styles.button_hover} ${styles.invite_button} text-md-medium`}
              onClick={handleInvite}
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
            onClick={handleInvite}
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

      {invitationList.map((invitation) => (
        <div key={invitation.id} className={styles.invite_cancle_container}>
          <div>
            <div className={`${styles.edit_invite_email} text-lg-regular`}>
              {invitation.invitee.email}
            </div>
          </div>
          <CommonButton
            variant="secondary"
            isActive={true}
            className={`${styles.edit_cancel_button} text-md-medium`}
            onClick={() => handleInviteCancel(invitation.id)}
          >
            취소
          </CommonButton>
        </div>
      ))}
    </div>
  )
}
