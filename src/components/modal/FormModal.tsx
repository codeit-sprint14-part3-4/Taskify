import Image from 'next/image'
import React from 'react'
import styles from './formmodal.module.css'
import baseStyle from './basemodal.module.css'
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

  return (
    <div className={baseStyle.overlay}>
      <div className={`${baseStyle.modal} ${styles[size]}`}>
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

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onConfirm()
          }}
        >
          <label className={styles.modalLabel}>{inputLabel}</label>
          <input
            type="text"
            value={inputValue}
            onChange={onChange}
            className={`${styles.modalInput} ${
              errorMessage ? styles.errorInput : ''
            }`}
          />
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}

          <div className={baseStyle.buttonGroup}>
            <button
              type="button"
              className={`${baseStyle.cancelButton} ${
                isLarge ? styles.cancelLarge : styles.cancelSmall
              }`}
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              className={`${baseStyle.confirmButton} ${
                isLarge ? styles.confirmLarge : styles.confirmSmall
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
