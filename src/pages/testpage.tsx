import Sidebar from '@/components/layout/sidebar/Sidebar'
import HomeNavBar from '@/components/layout/gnb/HomeNavBar'
import styles from './testpage.module.css'

export default function TestPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <div className={styles.navbar}>
          <HomeNavBar />
        </div>
        <main>본문내용을입력해주세요잉</main>
      </div>
    </div>
  )
}
