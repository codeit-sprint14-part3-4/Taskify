import styles from './editMyDashboardMember.module.css'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import Image from 'next/image'
import ArrowLeft from '../../../../../public/assets/icon/arrow-left-gray.svg'
import ArrowRight from '../../../../../public/assets/icon/arrow-right-gray.svg'
import Badge from '@/components/common/badge/Badge'

export default function EditMyDashboardMember() {
  const members = [
    { id: 1, name: '정만철' },
    { id: 2, name: '김태순' },
    { id: 3, name: '최주협' },
    { id: 4, name: '윤지현' },
  ]
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

        {members.map((member) => (
          <div key={member.id} className={styles.member_delete_container}>
            <div
              className={`${styles.edit_member_flex_container} ${styles.edit_member_flex_gap}`}
            >
              <Badge nickname={member.name || '닉네임없음'} />
              <div className={`${styles.edit_member_name} text-lg-regular`}>
                {member.name}
              </div>
            </div>

            <CommonButton
              variant="secondary"
              padding="0.4rem 2.95rem"
              isActive={true}
              className={`${styles.edit_delete_button} text-md-medium`}
              // 이벤트 핸들러 추가하기
            >
              삭제
            </CommonButton>
          </div>
        ))}
      </div>
    </>
  )
}
