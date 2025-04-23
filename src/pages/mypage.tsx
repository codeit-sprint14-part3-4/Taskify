import Image from 'next/image'
import { useRouter } from 'next/router'
import Sidebar from '@/components/layout/sidebar/Sidebar'
import Button from '@/components/common/button/Button'
import styles from '@/styles/Mypage.module.css'

export default function MyPage() {
  const router = useRouter()

  return (
    <div className={styles.layout}>
      <Sidebar />

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
          <div className={`${styles.card} ${styles.profileCard}`}>
            <div className={styles.sectionTitle}>프로필</div>
            <div className={styles.profileWrapper}>
              <div className={styles.avatar}>+</div>
              <div className={styles.profileForm}>
                <label>이메일</label>
                <input type="email" placeholder="Taskify@gmail.com" />
                <label>닉네임</label>
                <input type="text" placeholder="닉네임 입력" />
                <Button variant="confirm" className={styles.saveButton}>
                  저장
                </Button>
              </div>
            </div>
          </div>

          {/* 비밀번호 변경 섹션 */}
          <div className={`${styles.card} ${styles.passwordCard}`}>
            <div className={styles.sectionTitle}>비밀번호 변경</div>
            <div className={styles.passwordForm}>
              <label>현재 비밀번호</label>
              <input type="password" placeholder="비밀번호 입력" />
              <label>새 비밀번호</label>
              <input type="password" placeholder="새 비밀번호 입력" />
              <label>새 비밀번호 확인</label>
              <input type="password" placeholder="새 비밀번호 입력" />
              <Button variant="confirm" className={styles.changeButton}>
                변경
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
