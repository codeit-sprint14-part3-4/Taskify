'use client'

import React from 'react'
import styles from './input.module.css'
import InputProps from '@/types/common/input'

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  type = 'text',
  placeholder = '',
  disabled = false,
  readOnly = false,
  error,
  className = '',
  padding = '14px 16px', // ✨ 기본 padding
  height = '40px', // ✨ 기본 height
  icon,
  width,
}) => {
  return (
    <div className="flex flex-col">
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={`
            block appearance-none leading-none
            ${styles.input}
            ${error ? styles.error : ''}
            ${className}
          `}
          style={{
            width: width || '100%',
            padding: padding,
            height: height, // ✨ 여기도
          }}
        />
        {icon && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  )
}

export default Input
