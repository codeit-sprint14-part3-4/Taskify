import React from 'react'
import baseStyle from './baseModal.module.css'
import styles from './modal.module.css'

interface ModalButtonProps {
  type: 'button' | 'submit'
  onClick?: () => void
  label: string
  isCancel?: boolean
  size: 'small' | 'large'
  disabled?: boolean
}

const ModalButton: React.FC<ModalButtonProps> = ({
  type,
  onClick,
  label,
  isCancel = false,
  size,
  disabled,
}) => {
  let buttonClass = ''

  if (isCancel) {
    // 취소 버튼일 경우
    buttonClass = size === 'large' ? styles.cancelLarge : styles.cancelSmall
  } else {
    // 확인 버튼일 경우
    buttonClass = size === 'large' ? styles.confirmLarge : styles.confirmSmall
  }

  const baseClass = baseStyle[isCancel ? 'cancelButton' : 'confirmButton']
  const disabledClass = disabled ? baseStyle.disabledButton : ''

  return (
    <button
      type={type}
      className={`${baseStyle.button} ${baseClass} ${buttonClass} ${disabledClass}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

export default ModalButton
