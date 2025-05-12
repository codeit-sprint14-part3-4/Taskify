import clsx from 'clsx'
import styles from './commonButton.module.css'

type ButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  padding?: string
  isActive?: boolean
  className?: string
  onClick?: () => void
}

export default function CommonButton({
  children,
  variant = 'primary',
  padding,
  isActive = false,
  className = '',
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        styles.button,
        isActive && styles[`${variant}`],
        isActive ? styles.active : styles.inactive,
        className
      )}
      style={{ padding: padding }}
      disabled={!isActive}
    >
      {children}
    </button>
  )
}
