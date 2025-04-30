import styles from './editMyDashboardMember.module.css'
import CommonButton from '@/components/common/commonbutton/CommonButton'

export default function EditMyDashboardMember() {
  return (
    <>
      <div className={styles.edit_member_container}>
        <div className={styles.edit_member_header}>
          <div className={`text-2xl-bold`}>구성원</div>
          <div>
            <div>1 페이지 중 1</div>
            {/*페이지네이션 버튼*/}
          </div>
        </div>
        <div className={`${styles.edit_member_name_header} text-lg-regular`}>
          이름
        </div>
        <div className={styles.member_delete_container}>
          <div>
            <div className={`${styles.edit_member_name} text-lg-regular`}>
              정만철
            </div>
            {/*profile badge*/}
          </div>

          <CommonButton
            variant="secondary"
            padding="0.4rem 2.95rem"
            isActive={true}
            className={`${styles.edit_delete_button} text-md-medium`}
          >
            삭제
          </CommonButton>
        </div>

        <div className={styles.member_delete_container}>
          <div className={`${styles.edit_member_name} text-lg-regular`}>
            김태순
          </div>
          {/*profile badge*/}
          <CommonButton
            variant="secondary"
            padding="0.4rem 2.95rem"
            isActive={true}
            className={`${styles.edit_delete_button} text-md-medium`}
          >
            삭제
          </CommonButton>
        </div>

        <div className={styles.member_delete_container}>
          <div className={`${styles.edit_member_name} text-lg-regular`}>
            최주협
          </div>
          {/*profile badge*/}
          <CommonButton
            variant="secondary"
            padding="0.4rem 2.95rem"
            isActive={true}
            className={`${styles.edit_delete_button} text-md-medium`}
          >
            삭제
          </CommonButton>
        </div>

        <div className={styles.member_delete_container}>
          <div className={`${styles.edit_member_name} text-lg-regular`}>
            윤지현
          </div>
          {/*profile badge*/}
          <CommonButton
            variant="secondary"
            padding="0.4rem 2.95rem"
            isActive={true}
            className={`${styles.edit_delete_button} text-md-medium`}
          >
            삭제
          </CommonButton>
        </div>
      </div>
    </>
  )
}
