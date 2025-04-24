'use client'

import React from 'react'
import styles from './input.module.css'
import InputProps from '@/types/common/input'

const parsePaddingValue = (val?: string) => {
  if (!val) return {}

  const match = val.match(/^(px|py)-([\d.]+)$/)
  if (!match) return {}

  const [, direction, size] = match
  const remValue = `${size}rem`

  if (direction === 'px') {
    return {
      paddingRight: remValue,
    }
  } else if (direction === 'py') {
    return {
      paddingTop: remValue,
      paddingBottom: remValue,
    }
  }

  return {}
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  type = 'text',
  placeholder = '',
  disabled = false,
  readOnly = false,
  error,
  className = '',
  paddingwidth = 'px-1',
  paddingheight = 'py-1',
  icon,
}) => {
  const style = {
    paddingLeft: '1.5rem',
    ...parsePaddingValue(paddingwidth),
    ...parsePaddingValue(paddingheight),
  }

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
          style={style}
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
