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
  paddingwidth = 'px-1.4',
  paddingheight = 'px-1.6',
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
            ${paddingwidth} ${paddingheight}
          `}
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
