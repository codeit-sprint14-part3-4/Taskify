import styles from './dashboardlistbutton.module.css'
import Image from 'next/image'

import { ButtonHTMLAttributes, ReactNode } from 'react'

import ArrowRight from '../../../../public/assets/image/arrow-right.svg'

interface DashboardList
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'prefix'> {
  children?: ReactNode
  suffix?: ReactNode
}

const DashboardList = ({ children, suffix, onClick }: DashboardList) => {
  return (
    <button onClick={onClick} className={styles.wrapper}>
      <div className={styles.main_wrapper}>
        <div className={styles.main_left}>
          <div className={styles.main_color}>컬러</div>
          <div className={styles.main_left}>
            {children && <span>{children}</span>}
            <div className={styles.crown}>
              {suffix && <div className={styles.icon}>{suffix}</div>}
            </div>
          </div>
        </div>
        <div>
          <Image
            src={ArrowRight}
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
