import React from 'react'
import Image from 'next/image'
import styles from './formModal.module.css'
import baseStyle from './baseModal.module.css'
import ModalButton from './ModalButton'
import { FormModalProps } from '@/types/common/formmodal'

export default function FormModal({
  title,
  inputLabel,
  inputValue,
  onChange,
  onCancel, // 취소
  onDelete, // 삭제
  onEdit, // 변경
  onCreate, // 생성
  errorMessage,
  size = 'small',
  cancelLabel = '취소',
  showCloseButton = false, // 닫기 이미지 표시
  mode,
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
            {mode === 'delete' && onDelete && onEdit && (
              <>
                <ModalButton
                  type="button"
                  onClick={onDelete}
                  label="삭제"
                  isCancel={true}
                  size={size}
                />
                <ModalButton
                  type="button"
                  onClick={onEdit}
                  label="변경"
                  isCancel={false}
                  size={size}
                />
              </>
            )}

            {/* 기본 모드에서는 취소와 생성 버튼만 표시 */}
            {mode === 'default' && (
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
                  onClick={onCreate} // 생성은 onCreate 함수 실행
                  label="생성"
                  isCancel={false}
                  size={size}
                />
              </>
            )}
            <ModalButton type="submit" label={confirmLabel} size={size} />
          </div>
        </form>
      </div>
    </div>
  )
}
