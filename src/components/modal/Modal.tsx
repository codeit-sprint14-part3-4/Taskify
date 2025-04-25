import React from 'react'
import styles from '@/components/modal/modal.module.css'
import baseStyle from './basemodal.module.css'
import { ModalProps } from '@/types/common/modal'

export default function Modal({
  message,
  onConfirm,
  onCancel,
  size = 'small',
  confirmLabel,
  cancelLabel,
}: ModalProps) {
  const isAlertOnly = !onCancel

  const confirmSizeClass = isAlertOnly
    ? size === 'large'
      ? styles.alertConfirmLarge
      : styles.alertConfirmSmall
    : size === 'large'
    ? styles.confirmLarge
    : styles.confirmSmall

  const modalSizeClass = isAlertOnly
    ? size === 'large'
      ? styles.alertLarge
      : styles.alertSmall
    : size === 'large'
    ? styles.large
    : styles.small

  const messageClass = isAlertOnly
    ? size === 'large'
      ? styles.alertMessageLarge
      : styles.alertMessageSmall
    : size === 'large'
    ? styles.messageLarge
    : styles.messageSmall

  return (
    <div className={baseStyle.overlay}>
      <div className={`${baseStyle.modal} ${modalSizeClass}`}>
        <p className={messageClass}>{message}</p>
        <div className={baseStyle.buttonGroup}>
          {!isAlertOnly && (
            <button
              className={`${baseStyle.cancelButton} ${
                size === 'large' ? styles.cancelLarge : styles.cancelSmall
              }`}
              onClick={onCancel}
            >
              {cancelLabel || '취소'}
            </button>
          )}
          <button
            className={`${baseStyle.confirmButton} ${confirmSizeClass}`}
            onClick={onConfirm}
          >
            {confirmLabel || (onCancel ? '삭제' : '확인')}
          </button>
        </div>
      </div>
    </div>
  )
}
