import CommonButton from '@/components/common/commonbutton/CommonButton'
import styles from './invitedlist.module.css'

const InvitedList = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main_wrapper}>
        <div className={styles.dashboard_title}>프로젝트 제목</div>
        <div className={styles.inviter_name}> 초대자 이름</div>
        <div className={styles.button_wrapper}>
          <CommonButton
            variant="primary"
            isActive={true}
            padding="0.5rem 2.95rem"
            className="rounded-sm-[1px] text-[#5534DA]"
          >
            수락
          </CommonButton>
          <CommonButton
            variant="secondary"
            isActive={true}
            padding="0.5rem 2.95rem"
            className="rounded-sm-[1px] text-[#5534DA]"
          >
            거절
          </CommonButton>
        </div>
      </div>
    </div>
  )
}

export default InvitedList
