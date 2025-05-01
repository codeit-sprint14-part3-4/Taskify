import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import styles from './userDropdown.module.css'

export interface User {
  id: number
  name: string
  badgeColor: string
}

interface UserDropdownProps {
  users?: User[]
  selectedUser?: User
  onChange: (user: User) => void
  mode?: 'search' | 'select'
  className?: string
}

export default function UserDropdown({
  users = [],
  selectedUser,
  onChange,
  mode = 'search',
  className = '',
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const matchedUser = useMemo(() => {
    return users.find((user) => user.name === inputValue)
  }, [users, inputValue])

  const filteredUsers = useMemo(() => {
    return mode === 'search'
      ? users.filter((user) =>
          user.name?.toLowerCase().includes(inputValue.toLowerCase())
        )
      : users
  }, [users, inputValue, mode])

  const handleSelect = useCallback(
    (user: User) => {
      if (!user || typeof user.id !== 'number' || !user.name) return
      onChange(user)
      setInputValue(user.name)
      setIsOpen(false)
      setFocusedIndex(0)
    },
    [onChange]
  )

  const getInitial = useCallback((name?: string) => {
    if (!name || typeof name !== 'string') return 'U'
    const firstChar = name.trim().charAt(0)
    const isEnglish = /^[A-Za-z]$/.test(firstChar)
    const hangulToRoman: Record<string, string> = {
      하: 'H',
      배: 'B',
      김: 'K',
      이: 'L',
      박: 'P',
      최: 'C',
      정: 'J',
      강: 'K',
      조: 'J',
      윤: 'Y',
      장: 'J',
    }
    return isEnglish ? firstChar.toUpperCase() : hangulToRoman[firstChar] || 'U'
  }, [])

  useEffect(() => {
    if (mode === 'search' && selectedUser) {
      setInputValue(selectedUser.name)
    }
  }, [selectedUser, mode])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!isOpen) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex((prev) => (prev + 1) % filteredUsers.length)
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex(
        (prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length
      )
    }
    if (e.key === 'Enter' && filteredUsers.length > 0) {
      e.preventDefault()
      handleSelect(filteredUsers[focusedIndex])
    }
  }

  return (
    <div ref={dropdownRef} className={`${styles.container} ${className}`}>
      <div className={styles.inputWrapper}>
        {mode === 'search' && matchedUser ? (
          <div
            style={{ backgroundColor: matchedUser.badgeColor }}
            className={styles.badge}
          >
            {getInitial(matchedUser.name)}
          </div>
        ) : null}

        {mode === 'search' ? (
          <>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setIsOpen(true)
                setFocusedIndex(0)
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="이름을 입력해 주세요"
              className={`${styles.input} ${
                matchedUser ? styles.inputWithIcon : ''
              } ${inputValue === '' ? styles.placeholder : styles.inputText}`}
            />
            <Image
              src="/assets/image/arrow-down.svg"
              alt="Arrow Down"
              width={24}
              height={24}
              className={`${styles.arrow} ${isOpen ? styles.rotate : ''}`}
            />
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            onKeyDown={handleKeyDown}
            className={`${styles.selectButton} ${
              selectedUser?.name ? styles.inputText : styles.placeholder
            }`}
          >
            <div className={styles.userInfo}>
              {selectedUser && (
                <div
                  style={{ backgroundColor: selectedUser.badgeColor }}
                  className={styles.initialCircle}
                >
                  {getInitial(selectedUser.name)}
                </div>
              )}
              <span className={styles.userName}>
                {selectedUser?.name || '이름을 입력해 주세요'}
              </span>
            </div>
            <Image
              src="/assets/image/arrow-down.svg"
              alt="Arrow Down"
              width={20}
              height={20}
              className={`${styles.arrow} ${isOpen ? styles.rotate : ''}`}
            />
          </button>
        )}
      </div>

      {isOpen && (
        <ul className={styles.dropdown}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <li
                key={`user-${user.id}`}
                onClick={() => handleSelect(user)}
                className={`${styles.option} ${
                  index === focusedIndex
                    ? styles.optionFocused
                    : selectedUser?.id === user.id
                    ? styles.optionSelected
                    : ''
                }`}
              >
                {selectedUser?.id === user.id ? (
                  <Image
                    src="/assets/image/check.svg"
                    alt="선택됨"
                    width={22}
                    height={22}
                    className={styles.checkIcon}
                  />
                ) : (
                  <div className={styles.checkSpacer} />
                )}
                <div
                  style={{ backgroundColor: user.badgeColor }}
                  className={styles.initialCircle}
                >
                  {getInitial(user.name)}
                </div>
                <span className={styles.userName}>{user.name}</span>
              </li>
            ))
          ) : (
            <div className={styles.empty}>😟 일치하는 사용자가 없습니다!!</div>
          )}
        </ul>
      )}
    </div>
  )
}
