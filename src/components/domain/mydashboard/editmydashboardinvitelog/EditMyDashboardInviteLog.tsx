import styles from './editMyDashboardInviteLog.module.css'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import Image from 'next/image'
import ArrowLeft from '../../../../../public/assets/icon/arrow-left-gray.svg'
import ArrowRight from '../../../../../public/assets/icon/arrow-right-gray.svg'
import AddBox from '../../../../../public/assets/icon/add-box.svg'
import { Dashboard } from '@/types/api/dashboards'
import { useState, useEffect } from 'react'
import { dashboardsService } from '@/api/services/dashboardsServices'
import { Invitation } from '@/types/api/dashboards'
import FormModal from '../../modals/basemodal/FormModal'
import { useRouter } from 'next/router'

export default function EditMyDashboardInviteLog() {
  const router = useRouter()
  const id = Number(router.query.id)
  const [emailList, setEmailList] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')

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
          await dashboardsService.getDashboardsInvitations(id, 1, 10)
        console.log(inviteEmailData)
        setEmailList(inviteEmailData.invitations)
        setLoading(false)
      } catch (error) {
        console.error('이메일 정보를 불러오지 못했습니다', error)
        setLoading(false)
      }
    }
    fetchInviteEmail()
  }, [id])

  const handleConfirm = async () => {
    if (!inputValue) {
      setError('항목 이름을 입력하세요.')
      return
    }

    const body = {
      email: inputValue,
    }

    try {
      await dashboardsService.postDashboardsInvitations(id, body)
      setIsModalOpen(false)
      setError('')
      setInputValue('')
      alert('초대 신청이 완료됐어요.')
    } catch (error) {
      console.error('초대 버튼에서 에러가 발생했습니다. ', error)
    }
  }

  const handleInviteCancle = async (invitationId: number) => {
    try {
      await dashboardsService.deleteDashboardsInvitations(id, invitationId)
      alert('취소 완료')
      setEmailList((prev) => prev.filter((email) => email.id !== invitationId))
    } catch (error) {
      console.error('초대 거절 에러가 발생했습니다. ', error)
    }
  }

  return (
    <>
      <div className={styles.edit_invite_container}>
        <div className={styles.edit_invite_header_flex_container}>
          <div className={`text-2xl-bold`}>초대 내역</div>
          <div className={styles.edit_invite_header_flex_container}>
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
            <CommonButton
              variant="primary"
              padding="0.8rem 2rem 0.7rem 2rem"
              isActive={true}
              className="text-md-medium flex items-center justify-center gap-3"
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
        {isModalOpen && (
          <FormModal
            size="large"
            title="초대하기"
            inputLabel="이메일"
            inputValue={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            errorMessage={error}
            confirmLabel="생성"
            cancelLabel="취소"
          />
        )}

        <div className={`${styles.edit_invite_email_header} text-lg-regular`}>
          이메일
        </div>

        {emailList.map((invitations) => (
          <div key={invitations.id} className={styles.invite_cancle_container}>
            <div>
              <div className={`${styles.edit_invite_email} text-lg-regular`}>
                {invitations.invitee.email}
              </div>
            </div>
            <CommonButton
              variant="secondary"
              padding="0.4rem 2.95rem"
              isActive={true}
              className={`${styles.edit_cancel_button} text-md-medium`}
              onClick={() => handleInviteCancle(invitations.id)}
            >
              취소
            </CommonButton>
          </div>
        ))}
      </div>
    </>
  )
}
