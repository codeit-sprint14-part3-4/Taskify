import styles from './ButtonDashboard.module.css'
import clsx from 'clsx'
import { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'textOnly' | 'iconOnly' // 3가지 중 하나만 가질 수 있는 타입 선언

interface ButtonDashboardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode // 텍스트 없을 수도 있음
  variant?: Variant
  textSize?: string
  color?: string
  backgroundColor?: string
  paddingHeight?: string
  paddingWidth?: string
  startIcon?: ReactNode // 앞에다 아이콘 넣을 건지
  endIcon?: ReactNode // 뒤에다 아이콘 넣을 건지
}

export default function ButtonDashboard({
  children,
  onClick,
  type = 'button',
  variant = 'textOnly',
  startIcon,
  endIcon,
  ...props
}: ButtonDashboardProps) {
  const buttonClass = clsx(styles.button, {
    [styles.textOnly]: variant === 'textOnly',
    [styles.iconOnly]: variant === 'iconOnly',
  })

  return (
    <div className={styles.buttonWrapper}>
      <button className={buttonClass} onClick={onClick} type={type} {...props}>
        {startIcon && <span className={styles.iconOnly}>{startIcon}</span>}
        {children && <span className={styles.textOnly}>{children}</span>}
        {endIcon && <span className={styles.iconOnly}>{endIcon}</span>}
      </button>
    </div>
  )
}
