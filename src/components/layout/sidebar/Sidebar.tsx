import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Link href="/" className={styles.logo}>
        <Image
          src="/assets/icon/logo-icon.svg"
          alt="Taskify Icon"
          className={styles.logoIcon}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
        />
        <Image
          src="/assets/icon/logo-title.svg"
          alt="Taskify Title"
          className={styles.logoTitle}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
        />
      </Link>

      <ul className={styles.menu}>
        <li className={styles.menuItem}>
          <span className={`${styles.link} text-xs-semibold`}>Dash Boards</span>
          <button className={styles.addButton}>
            <Image
              src="/assets/image/add-box.svg"
              alt="Add"
              className=""
              width={20}
              height={20}
            />
          </button>
        </li>
      </ul>
    </div>
  )
}
