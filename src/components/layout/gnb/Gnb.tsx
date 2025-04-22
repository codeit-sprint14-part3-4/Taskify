// src/components/Gnb.tsx
import Link from 'next/link'
import Image from 'next/image'
import styles from './gnb.module.css'
import logo_taskify from '../../../../public/assets/image/logo_taskify.svg'
import text_taskify from '../../../../public/assets/image/text_taskify.svg'

const Gnb = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.navWrapper}>
        <Link href={'/'} className={styles.logo}>
          <Image src={logo_taskify} alt="Logo" />
          <Image src={text_taskify} alt="Logo" className={styles.logotext} />
        </Link>

        <ul className={styles.login}>
          <li>
            <Link href="/login">로그인</Link>
          </li>
          <li>
            <Link href="/signup">회원가입</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Gnb
