import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import styles from './userDropdown.module.css'
import Badge from '../common/badge/Badge'

export interface User {
  id: number
  name: string
  badgeColor: string
  profileImageUrl: string
}

interface UserDropdownProps {
  users?: User[]
  selectedUser?: User
  onChange: (user: User | undefined) => void
  mode?: 'search' | 'select'
  className?: string
  setAssignee: React.Dispatch<number>
}

export default function UserDropdown({
  users = [],
  selectedUser,
  onChange,
  mode = 'search',
  className = '',
  setAssignee,
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const matchedUser = users.find((user) => user.name === inputValue)

  const filteredUsers =
    mode === 'search'
      ? users.filter((user) =>
          user.name?.toLowerCase().includes(inputValue.toLowerCase())
        )
      : users

  const handleSelect = useCallback(
    (user: User) => {
      if (!user || typeof user.id !== 'number' || !user.name) return
      onChange(user)
      setInputValue(user.name)
      setIsOpen(false)
      setFocusedIndex(0)
      setAssignee(user.id)
    },
    [onChange]
  )

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
    if (!isOpen || filteredUsers.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (filteredUsers.length > 0) {
        setFocusedIndex((prev) => (prev + 1) % filteredUsers.length)
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (filteredUsers.length > 0) {
        setFocusedIndex(
          (prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length
        )
      }
    }

    if (e.key === 'Enter' && filteredUsers.length > 0) {
      e.preventDefault()
      const selectedUser = filteredUsers[focusedIndex]
      handleSelect(selectedUser)
    }
  }

  return (
    <div ref={dropdownRef} className={`${styles.container} ${className}`}>
      <div className={styles.inputWrapper}>
        {mode === 'search' && matchedUser ? (
          matchedUser.profileImageUrl ? (
            <Image
              src={matchedUser.profileImageUrl}
              alt="프로필 이미지"
              width={24}
              height={24}
              className="absolute left-[1.6rem] w-[2.6rem] h-[2.6rem] rounded-full object-cover"
            />
          ) : (
            <div className="w-[2.6rem] h-[2.6rem] absolute top-[0.4rem] left-[1.3rem]">
              <Badge nickname={matchedUser.name} />
            </div>
          )
        ) : null}

        {mode === 'search' ? (
          <>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                const newValue = e.target.value
                setInputValue(newValue)
                setIsOpen(true)
                setFocusedIndex(0)
                if (newValue.trim() === '') {
                  onChange(undefined)
                }
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
              {selectedUser ? (
                selectedUser.profileImageUrl ? (
                  <>
                    <Image
                      src={selectedUser.profileImageUrl}
                      alt="프로필 이미지"
                      width={24}
                      height={24}
                      className="w-[2.6rem] h-[2.6rem] rounded-full object-cover"
                    />
                    <span className={styles.userName}>{selectedUser.name}</span>
                  </>
                ) : (
                  <>
                    <Badge nickname={selectedUser.name} />
                    <span className={styles.userName}>{selectedUser.name}</span>
                  </>
                )
              ) : (
                <span className={styles.userName}>
                  {'이름을 선택해 주세요'}
                </span>
              )}
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
            filteredUsers.map((user, index) => {
              const isFocused = index === focusedIndex
              const isSelected = selectedUser?.id === user.id

              return (
                <li
                  key={`user-${user.id}`}
                  onClick={() => handleSelect(user)}
                  className={`${styles.option} ${
                    isFocused ? styles.optionFocused : ''
                  } ${isSelected ? styles.optionSelected : ''}`}
                >
                  {isSelected ? (
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
                  {user.profileImageUrl ? (
                    <>
                      <Image
                        src={user.profileImageUrl}
                        alt="프로필 이미지"
                        width={24}
                        height={24}
                        className="w-[2.6rem] h-[2.6rem] rounded-full object-cover"
                      />
                      <span className={styles.userName}>{user.name}</span>
                    </>
                  ) : (
                    <>
                      <Badge nickname={user.name} />
                      <span className={styles.userName}>{user.name}</span>
                    </>
                  )}
                </li>
              )
            })
          ) : (
            <li className={styles.empty}>😟 일치하는 사용자가 없습니다!!</li>
          )}
        </ul>
      )}
    </div>
  )
}
