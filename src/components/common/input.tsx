'use client'

import React from 'react'

interface InputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  error?: string
  className?: string
  padding?: string
  height?: string
  icon?: React.ReactNode
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
  padding = 'py-2 px-3',
  height = 'h-10',
  icon,
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
          className={`block w-full border rounded 
            border-red-300
            appearance-none
            leading-none
            ${padding} ${height}
            ${error ? 'border-red-500' : 'border-gray-300'}
            pr-10
            ${className}`}
        />
        {icon && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  )
}

export default Input
