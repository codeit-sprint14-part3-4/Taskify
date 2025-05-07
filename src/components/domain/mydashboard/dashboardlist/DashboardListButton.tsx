import styles from './dashboardListButton.module.css'
import Image from 'next/image'

import { ButtonHTMLAttributes, ReactNode } from 'react'

interface DashboardList
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'prefix'> {
  children?: ReactNode
  suffix?: ReactNode
  colorPin?: ReactNode
}

const DashboardList = ({
  children,
  suffix,
  onClick,
  colorPin,
}: DashboardList) => {
  return (
    <button onClick={onClick} className={styles.wrapper}>
      <div className={styles.main_wrapper}>
        <div className={styles.main_left}>
          <div className={styles.main_color}>{colorPin}</div>
          <div className={styles.main_flex}>
            <span className={styles.crown_title}>{children}</span>

            <div className={styles.crown}>
              {suffix && <div className={styles.icon}>{suffix}</div>}
            </div>
          </div>
        </div>
        <div>
          <Image
            src="/assets/image/arrow-right.svg"
            alt="ArrowRight"
            width={7}
            height={14}
            className="object-contain"
          />
        </div>
      </div>
    </button>
  )
}

export default DashboardList
