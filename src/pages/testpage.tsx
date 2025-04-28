import Gnb from '@/components/layout/gnb/Gnb'

import Sidebar from '@/components/layout/sidebar/Sidebar'
import HomeNavBar from '@/components/layout/gnb/HomeNavBar'
import styles from './testpage.module.css'

export default function TestPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.navbar}>
        <HomeNavBar />
        <main>본문내용을입력해주세요잉</main>
      </div>
    </div>
  )
}
