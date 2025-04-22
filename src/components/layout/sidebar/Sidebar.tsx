import React from 'react'
import Link from 'next/link'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Link href="/" className={styles.logo}>
        <img
          src="/assets/icon/logo-icon.svg"
          alt="Taskify Icon"
          className={styles.logoIcon}
        />
        <img
          src="/assets/icon/logo-title.svg"
          alt="Taskify Title"
          className={styles.logoTitle}
        />
      </Link>

      <ul className={styles.menu}>
        <li className={styles.menuItem}>
          <span className={`${styles.link} text-xs-semibold`}>Dash Boards</span>
          <button className={styles.addButton}>
            <img src="/assets/image/add-box.svg" alt="Add" />
          </button>
        </li>
      </ul>
    </div>
  )
}
