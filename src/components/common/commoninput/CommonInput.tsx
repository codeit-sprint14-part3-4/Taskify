import React from 'react'
import styles from './commonInput.module.css'
import InputProps from '@/types/common/input'

const CommonInput: React.FC<InputProps> = ({
  value,
  onChange,
  type = 'text',
  placeholder = '',
  disabled = false,
  readOnly = false,
  error,
  className = '',
  padding = '14px 16px',
  height = '40px',
  icon,
  width,
  onBlur,
  onKeyDown,
  iconPosition = 'right',
}) => {
  return (
    <div className="flex flex-col">
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          onKeyDown={onKeyDown}
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
            height: height,
          }}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  )
}

export default CommonInput
