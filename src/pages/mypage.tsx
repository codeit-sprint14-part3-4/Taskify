import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from '@/pages/mypage.module.css'

import CommonButton from '@/components/common/commonbutton/CommonButton'
import Layout from '@/components/layout/layout'

export default function MyPage() {
  const router = useRouter()

  return (
    <Layout pageType="mypage">
      <div className={styles.content}>
        <div className={styles.backWrapper}>
          <button className={styles.backButton} onClick={() => router.back()}>
            <Image
              src="/assets/image/arrow-left.svg"
              alt="뒤로가기"
              width={16}
              height={16}
              className={styles.backIcon}
            />
            <span className={styles.backText}>돌아가기</span>
          </button>
        </div>

        <div className={styles.cardGroup}>
          {/* 프로필 섹션 */}
          <section className={`${styles.card} ${styles.profileCard}`}>
            <h2 className={styles.sectionTitle}>프로필</h2>
            <div className={styles.profileWrapper}>
              <div className={styles.avatar}>+</div>
              <div className={styles.profileForm}>
                <label>이메일</label>
                <input type="email" placeholder="Taskify@gmail.com" />
                <label>닉네임</label>
                <input type="text" placeholder="닉네임 입력" />
                <CommonButton
                  variant="primary"
                  padding="1.2rem 1.2rem"
                  className={styles.saveButton}
                >
                  저장
                </CommonButton>
              </div>
            </div>
          </section>

          {/* 비밀번호 변경 섹션 */}
          <section className={`${styles.card} ${styles.passwordCard}`}>
            <h2 className={styles.sectionTitle}>비밀번호 변경</h2>
            <div className={styles.passwordForm}>
              <label>현재 비밀번호</label>
              <input type="password" placeholder="비밀번호 입력" />
              <label>새 비밀번호</label>
              <input type="password" placeholder="새 비밀번호 입력" />
              <label>새 비밀번호 확인</label>
              <input type="password" placeholder="새 비밀번호 입력" />
              <CommonButton
                variant="primary"
                padding="1.2rem 1.2rem"
                className={styles.changeButton}
              >
                변경
              </CommonButton>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}
