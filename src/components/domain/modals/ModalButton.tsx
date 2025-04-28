import React from 'react'
import baseStyle from './basemodal.module.css'
import styles from './modal.module.css'

interface ModalButtonProps {
  type: 'button' | 'submit'
  onClick?: () => void
  label: string
  isCancel?: boolean
  size: 'small' | 'large'
}

const ModalButton: React.FC<ModalButtonProps> = ({
  type,
  onClick,
  label,
  isCancel = false,
  size,
}) => {
  let buttonClass = ''

  if (isCancel) {
    // 취소 버튼일 경우
    if (size === 'large') {
      buttonClass = styles.cancelLarge
    } else {
      buttonClass = styles.cancelSmall
    }
  } else {
    // 확인 버튼일 경우
    if (size === 'large') {
      buttonClass = styles.confirmLarge
    } else {
      buttonClass = styles.confirmSmall
    }
  }

  return (
    <button
      type={type}
      className={`${baseStyle.button} ${
        baseStyle[isCancel ? 'cancelButton' : 'confirmButton']
      } ${buttonClass}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default ModalButton
