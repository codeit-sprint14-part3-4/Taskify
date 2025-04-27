import styles from './buttonDashboard.module.css'
import clsx from 'clsx'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonDashboardProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'prefix'> {
  children?: ReactNode

  paddingHeight?: string
  paddingWidth?: string
  gap?: string
  prefix?: ReactNode
  suffix?: ReactNode
  color?: string
}

export default function ButtonDashboard({
  children,
  paddingHeight,
  paddingWidth,
  gap,
  prefix,
  suffix,
  color,
  className,
  style,
  onClick,

  ...rest
}: ButtonDashboardProps) {
  const buttonClass = clsx(className)

  const innerClass = clsx(
    styles.buttonInner,
    paddingHeight,
    paddingWidth,
    color,
    {
      'flex justify-center items-center': !children,
      flex: children,
    },
    gap
  )

  return (
    <div>
      <button
        onClick={onClick}
        className={clsx(styles.buttonWrapper, buttonClass)}
        style={style}
        {...rest}
      >
        <div className={innerClass}>
          {prefix && <span className={styles.icon}>{prefix}</span>}
          {children && <span>{children}</span>}
          {suffix && <span className={styles.icon}>{suffix}</span>}
        </div>
      </button>
    </div>
  )
}
