import styles from './editMyDashboardInviteLog.module.css'
import CommonButton from '@/components/common/commonbutton/CommonButton'

export default function EditMyDashboardInviteLog() {
  return (
    <>
      <div className={styles.edit_invite_container}>
        <div className={styles.edit_invite_header_flex_container}>
          <div className={`text-2xl-bold`}>초대 내역</div>
          <div className={styles.edit_invite_header_flex_container}>
            <div>1 페이지 중 1</div>
            {/*페이지네이션 버튼*/}
            <CommonButton
              variant="primary"
              padding="0.8rem 1.6rem"
              isActive={true}
              className={`text-md-medium`}
            >
              초대하기
            </CommonButton>
          </div>
        </div>
        <div className={`${styles.edit_invite_email_header} text-lg-regular`}>
          이메일
        </div>
        <div className={styles.invite_cancle_container}>
          <div>
            <div className={`${styles.edit_invite_email} text-lg-regular`}>
              codeitA@codeit.com
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

        <div className={styles.invite_cancle_container}>
          <div>
            <div className={`${styles.edit_invite_email} text-lg-regular`}>
              codeitB@codeit.com
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

        <div className={styles.invite_cancle_container}>
          <div>
            <div className={`${styles.edit_invite_email} text-lg-regular`}>
              codeitC@codeit.com
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

        <div className={styles.invite_cancle_container}>
          <div>
            <div className={`${styles.edit_invite_email} text-lg-regular`}>
              codeitD@codeit.com
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

        <div className={styles.invite_cancle_container}>
          <div>
            <div className={`${styles.edit_invite_email} text-lg-regular`}>
              codeitE@codeit.com
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
      </div>
    </>
  )
}
