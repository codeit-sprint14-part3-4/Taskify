import React from 'react'
import Image from 'next/image'
import styles from './formModal.module.css'
import baseStyle from './baseModal.module.css'
import ModalButton from './ModalButton'
import { FormModalProps } from '@/types/common/formmodal'

export default function FormModal(props: FormModalProps) {
  const {
    title,
    inputLabel,
    inputValue,
    onChange,
    onCancel,
    errorMessage,
    size = 'small',
    cancelLabel = '취소',
    showCloseButton = false,
  } = props

  const isLarge = size === 'large'
  const closeIconSize = isLarge ? 36 : 24
  const inputId = 'modal-input'
  const mode = props.mode ?? 'default'

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
          <div className={baseStyle.buttonGroup} style={{ display: 'flex' }}>
            {/* 삭제 모드일 때만 삭제와 변경 버튼을 표시 */}
            {props.mode === 'delete' &&
              'onDelete' in props &&
              'onEdit' in props && (
                <>
                  <ModalButton
                    type="button"
                    onClick={props.onDelete}
                    label="삭제"
                    isCancel={true}
                    size={size}
                  />
                  <ModalButton
                    type="button"
                    onClick={props.onEdit}
                    label="변경"
                    isCancel={false}
                    size={size}
                  />
                </>
              )}

            {/* 기본 모드에서는 취소와 생성 버튼만 표시 */}
            {mode === 'default' && 'onCreate' in props && (
              <>
                <ModalButton
                  type="button"
                  onClick={onCancel}
                  label={cancelLabel}
                  isCancel={true}
                  size={size}
                />
                <ModalButton
                  type="button"
                  onClick={props.onCreate}
                  label="생성"
                  isCancel={false}
                  size={size}
                  disabled={props.isSubmitDisabled}
                />
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
