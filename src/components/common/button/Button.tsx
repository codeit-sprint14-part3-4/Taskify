import styles from './button.module.css'
import classNames from 'classnames'

type ButtonProps = {
  children: React.ReactNode
  variant?:
    | 'login'
    | 'accept'
    | 'reject'
    | 'cancel'
    | 'confirm'
    | 'input'
    | 'delete'
  size?: 'large' | 'medium' | 'small' //가로가 긴 거를 large로 구분
  isActive?: boolean
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset' // 김수연 수정함. 엔터 누르면 버튼 누르고 제출되도록 변경하였습니다.
}

export default function Button({
  children,
  size = 'large', //기본값은 loginButton-large
  variant = 'login', //기본값은 login
  isActive = true, //기본적으로는 활성화, 로그인 버튼 등은 조건 불충족 시 false로
  className = '',
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        styles.button,
        styles[`${variant}Button`],
        styles[`${variant}-${size}`], //기본은 login-large
        isActive ? styles.active : styles.inactive,
        className
      )}
      disabled={!isActive}
    >
      {children}
    </button>
  )
}
