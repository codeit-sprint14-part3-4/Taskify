import React from 'react'
import styles from '@/components/domain/modals/basemodal/modal.module.css'
import baseStyle from '@/components/domain/modals/basemodal/baseModal.module.css'
import ModalButton from './ModalButton'
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
  const confirmText = confirmLabel || (onCancel ? '삭제' : '확인')

  // 모달 크기에 따른 스타일 계산
  const getModalClassNames = (size: string, isAlertOnly: boolean) => {
    let confirmClass = ''
    let modalClass = ''
    let messageClass = ''

    if (isAlertOnly) {
      confirmClass =
        size === 'large' ? styles.alertConfirmLarge : styles.alertConfirmSmall
      modalClass = size === 'large' ? styles.alertLarge : styles.alertSmall
      messageClass =
        size === 'large' ? styles.alertMessageLarge : styles.alertMessageSmall
    } else {
      confirmClass =
        size === 'large' ? styles.confirmLarge : styles.confirmSmall
      modalClass = size === 'large' ? styles.large : styles.small
      messageClass =
        size === 'large' ? styles.messageLarge : styles.messageSmall
    }

    return { confirmClass, modalClass, messageClass }
  }

  const { confirmClass, modalClass, messageClass } = getModalClassNames(
    size,
    isAlertOnly
  )

  return (
    <div className={baseStyle.overlay}>
      <div className={`${baseStyle.modal} ${modalClass}`}>
        {/* 메시지 */}
        <p className={messageClass}>{message}</p>

        {/* 버튼 그룹 */}
        <div className={baseStyle.buttonGroup}>
          {/* 취소 버튼 (onCancel이 있을 때만) */}
          {!isAlertOnly && (
            <ModalButton
              type="button"
              onClick={onCancel}
              label={cancelLabel || '취소'}
              isCancel={true}
              size={size}
            />
          )}

          {/* 확인 버튼 */}
          <ModalButton
            type="submit"
            onClick={onConfirm}
            label={confirmText}
            size={size}
          />
        </div>
      </div>
    </div>
  )
}
