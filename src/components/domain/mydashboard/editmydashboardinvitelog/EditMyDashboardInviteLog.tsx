import styles from './editMyDashboardInviteLog.module.css'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import Image from 'next/image'
import ArrowLeft from '../../../../../public/assets/icon/arrow-left-gray.svg'
import ArrowRight from '../../../../../public/assets/icon/arrow-right-gray.svg'
import AddBox from '../../../../../public/assets/icon/add-box.svg'

export default function EditMyDashboardInviteLog() {
  const invitedEmails = [
    'codeitA@codeit.com',
    'codeitB@codeit.com',
    'codeitC@codeit.com',
    'codeitD@codeit.com',
    'codeitE@codeit.com',
  ]

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
              /*이벤트 핸들러 추가하기*/
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
        <div className={`${styles.edit_invite_email_header} text-lg-regular`}>
          이메일
        </div>

        {invitedEmails.map((email, index) => (
          <div key={index} className={styles.invite_cancle_container}>
            <div>
              <div className={`${styles.edit_invite_email} text-lg-regular`}>
                {email}
              </div>
            </div>
            <CommonButton
              variant="secondary"
              padding="0.4rem 2.95rem"
              isActive={true}
              className={`${styles.edit_cancel_button} text-md-medium`}
            >
              취소
            </CommonButton>
          </div>
        ))}
      </div>
    </>
  )
}
