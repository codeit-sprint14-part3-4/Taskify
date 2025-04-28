import Link from 'next/link'
import Image from 'next/image'
import styles from './footerbar.module.css'

const Footerbar = () => {
  return (
    <footer className={styles.footer}>
      <div>©codeit - 2025</div>

      <div className={styles.footerWrapper}>
        <Link
          href="https://github.com/codeit-sprint14-part3-4/Taskify"
          className={`${styles.footermidlink}`}
          passHref
          target="_blank"
          rel="noopener noreferrer"
        >
          Git Hub
        </Link>
        <Link
          href="https://github.com/codeit-sprint14-part3-4/Taskify"
          className={`${styles.footermidlink}`}
          passHref
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </Link>
        <Link
          href="https://github.com/codeit-sprint14-part3-4/Taskify"
          className={`${styles.footermidlink}`}
          passHref
          target="_blank"
          rel="noopener noreferrer"
        >
          FAQ
        </Link>
      </div>

      <ul className={styles.footerlastlink}>
        <li>
          <Link
            href="https://github.com/codeit-sprint14-part3-4/Taskify"
            passHref
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/assets/icon/envelope-email-icon.svg"
              alt="email address"
              width={20}
              height={20}
            />
          </Link>
        </li>
        <li>
          <Link
            href="https://www.facebook.com/"
            passHref
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/assets/icon/facebook-icon.svg"
              alt="facebook address"
              width={22}
              height={22}
            />
          </Link>
        </li>
        <li>
          <Link
            href="https://www.instagram.com/"
            passHref
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/assets/icon/instagram-logo-icon.svg"
              alt="instagram address"
              width={22}
              height={22}
            />
          </Link>
        </li>
      </ul>
    </footer>
  )
}

export default Footerbar
