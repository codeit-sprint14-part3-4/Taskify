import React from 'react'
import styles from '@/components/domain/modals/basemodal/modal.module.css'
import baseStyle from '@/components/domain/modals/basemodal/baseModal.module.css'
import ModalButton from './ModalButton'
import { ModalProps } from '@/types/common/modal'

export default function DeleteActionModal({
  message,
  onCancel,
  onDelete,
  size = 'small',
  cancelLabel = '취소',
  deleteLabel = '삭제',
}: ModalProps) {
  // 모달 크기에 따른 스타일 계산
  const getModalClassNames = (size: string) => {
    return {
      modalClass: size === 'large' ? styles.large : styles.small,
      messageClass:
        size === 'large' ? styles.messageLarge : styles.messageSmall,
    }
  }

  const { modalClass, messageClass } = getModalClassNames(size)

  return (
    <div className={baseStyle.overlay}>
      <div className={`${baseStyle.modal} ${modalClass}`}>
        {/* 메시지 */}
        <p className={messageClass}>{message}</p>

        {/* 버튼 그룹 */}
        <div className={baseStyle.buttonGroup}>
          <ModalButton
            type="button"
            onClick={onCancel}
            label={cancelLabel}
            isCancel={true}
            size={size}
          />
          <ModalButton
            type="button"
            onClick={onDelete}
            label={deleteLabel}
            isCancel={false}
            size={size}
          />
        </div>
      </div>
    </div>
  )
}
