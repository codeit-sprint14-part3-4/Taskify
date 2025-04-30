import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import Image from 'next/image'

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

  const filteredUsers = useMemo(() => {
    const safeUsers = Array.isArray(users) ? users : []
    return mode === 'search'
      ? safeUsers.filter((user) => user.name?.startsWith(inputValue))
      : safeUsers
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
    <div ref={dropdownRef} className="relative w-full">
      <div className="relative flex items-center">
        {inputValue && filteredUsers.length > 0 && selectedUser ? (
          <div
            style={{ backgroundColor: selectedUser.badgeColor }}
            className="absolute left-[1.6rem] w-[2.6rem] h-[2.6rem] flex items-center justify-center rounded-full text-[var(--white-FFFFFF)] text-[1.4rem] font-bold z-10"
          >
            {getInitial(selectedUser.name)}
          </div>
        ) : (
          <div className="absolute left-[1.6rem] w-[2.6rem] h-[2.6rem]" />
        )}

        {mode === 'search' ? (
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
            className={`w-full h-[4.8rem] ${
              selectedUser ? 'pl-[5.6rem]' : 'pl-[1.6rem]'
            } pr-[4rem] py-[1.1rem] border border-[var(--gray-D9D9D9)] rounded-[0.8rem] text-lg-regular outline-none placeholder-[var(--gray-9FA6B2)] ${
              inputValue === ''
                ? 'text-[var(--gray-9FA6B2)]'
                : 'text-[var(--black-333236)]'
            } focus:border-[var(--violet-5534DhA)] focus:ring-0 ${className}`}
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            onKeyDown={handleKeyDown}
            className={`w-full h-[4.8rem] px-[1.6rem] border border-[var(--gray-D9D9D9)] rounded-[0.8rem] text-left text-lg-regular outline-none ${
              selectedUser?.name
                ? 'text-[var(--black-333236)]'
                : 'text-[var(--gray-9FA6B2)]'
            } focus:border-[var(--violet-5534DhA)] focus:ring-0 bg-[var(--white-FFFFFF)] flex items-center justify-between ${className}`}
          >
            <div className="flex items-center gap-[0.8rem]">
              <div
                style={{ backgroundColor: selectedUser?.badgeColor ?? '#ccc' }}
                className="w-[2.6rem] h-[2.6rem] flex items-center justify-center rounded-full text-[var(--white-FFFFFF)] text-[1.4rem] font-bold"
              >
                {selectedUser ? getInitial(selectedUser.name) : '?'}
              </div>
              <span className="truncate leading-none">
                {selectedUser?.name || '이름을 입력해 주세요'}
              </span>
            </div>

            <Image
              src="/assets/image/arrow-down.svg"
              alt="Arrow Down"
              width={20}
              height={20}
              className={`transition-transform duration-300 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}

        {mode === 'search' && (
          <Image
            src="/assets/image/arrow-down.svg"
            alt="Arrow Down"
            width={24}
            height={24}
            className={`absolute right-[1.6rem] transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        )}
      </div>

      {isOpen && (
        <ul className="absolute z-20 mt-[0.8rem] w-full border border-[var(--gray-D9D9D9)] bg-[var(--white-FFFFFF)] rounded-[0.8rem] transition-all duration-300 origin-top max-h-[20rem] overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => {
              if (!user || typeof user.id !== 'number' || !user.name)
                return null
              return (
                <li
                  key={`user-${user.id}`}
                  onClick={() => handleSelect(user)}
                  className={`flex items-center gap-[1.2rem] px-[1.6rem] cursor-pointer w-full h-[4.8rem] text-lg-regular transition-colors duration-200 ${
                    index === focusedIndex
                      ? 'bg-[var(--gray-EEEEEE)]'
                      : user.id === selectedUser?.id
                      ? 'bg-[var(--gray-FAFAFA)]'
                      : 'hover:bg-[var(--gray-FAFAFA)]'
                  }`}
                >
                  {user.id === selectedUser?.id ? (
                    <Image
                      src="/assets/image/check.svg"
                      alt="선택됨"
                      width={22}
                      height={22}
                      className="mr-[0.8rem]"
                    />
                  ) : (
                    <div className="w-[2.2rem] h-[2.2rem] mr-[0.8rem]" />
                  )}
                  <div
                    style={{ backgroundColor: user.badgeColor }}
                    className="w-[2.6rem] h-[2.6rem] flex items-center justify-center rounded-full text-[var(--white-FFFFFF)] text-[1.4rem] font-bold"
                  >
                    {getInitial(user.name)}
                  </div>
                  <span className="truncate">{user.name}</span>
                </li>
              )
            })
          ) : (
            <div className="flex items-center justify-center w-full h-[4.8rem] text-lg-regular text-[var(--red-D6173A)] bg-[var(--gray-FAFAFA)] rounded-[0.8rem]">
              😟 일치하는 사용자가 없습니다!!
            </div>
          )}
        </ul>
      )}
    </div>
  )
}
