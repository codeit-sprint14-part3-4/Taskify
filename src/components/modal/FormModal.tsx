import React from 'react'
import Image from 'next/image'
import styles from './formmodal.module.css'
import baseStyle from './basemodal.module.css'
import ModalButton from './ModalButton'
import { FormModalProps } from '@/types/common/formmodal'

export default function FormModal({
  title,
  inputLabel,
  inputValue,
  onChange,
  onConfirm,
  onCancel,
  errorMessage,
  size = 'small',
  confirmLabel = '확인',
  cancelLabel = '취소',
  showCloseButton = false,
}: FormModalProps) {
  const isLarge = size === 'large'
  const closeIconSize = isLarge ? 36 : 24
  const inputId = 'modal-input' // 고유 id

  return (
    <div className={baseStyle.overlay}>
      <div className={`${baseStyle.modal} ${styles[size]}`}>
        {/* 모달 헤더 */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>

          {showCloseButton && (
            <button
              className={styles.closeButton}
              onClick={onCancel}
              aria-label="닫기"
            >
              <Image
                src="/assets/image/close.svg"
                alt="닫기"
                width={closeIconSize}
                height={closeIconSize}
              />
            </button>
          )}
        </div>

        {/* 폼 영역 */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onConfirm()
          }}
        >
          {/* 인풋 라벨 */}
          <label htmlFor={inputId} className={styles.modalLabel}>
            {inputLabel}
          </label>

          {/* 인풋 필드 */}
          <input
            type="text"
            id={inputId}
            value={inputValue}
            onChange={onChange}
            className={`${styles.modalInput} ${
              errorMessage ? styles.errorInput : ''
            }`}
          />

          {/* 에러 메시지 */}
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}

          {/* 버튼 그룹 */}
          <div className={baseStyle.buttonGroup}>
            {onCancel && (
              <ModalButton
                type="button"
                onClick={onCancel}
                label={cancelLabel}
                isCancel={true}
                size={size}
              />
            )}
            <ModalButton
              type="submit"
              onClick={onConfirm}
              label={confirmLabel}
              size={size}
            />
          </div>
        </form>
      </div>
    </div>
  )
}
