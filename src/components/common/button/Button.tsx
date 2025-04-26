import styles from './button.module.css'
import classNames from 'classnames'

type ButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  padding: string
  isActive?: boolean
  className?: string
  onClick?: () => void
}

export default function Button({
  children,
  variant = 'primary', //기본값은 login
  padding = '1.4rem 1.4rem',
  isActive = false,
  className = '',
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(
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
