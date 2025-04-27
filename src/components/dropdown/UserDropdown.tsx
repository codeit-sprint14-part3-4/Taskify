import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'

interface User {
  id: number
  name: string
  badgeColor: string
}

interface UserDropdownProps {
  users: User[]
  selectedUser: User
  onChange: (user: User) => void
}

export default function UserDropdown({
  users,
  selectedUser,
  onChange,
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSelect = useCallback(
    (user: User) => {
      onChange(user)
      setIsOpen(false)
    },
    [onChange]
  )

  const getInitial = useCallback((name: string) => {
    if (!name) return 'U'
    const firstChar = name.trim().charAt(0)
    const isEnglish = /^[A-Za-z]$/.test(firstChar)
    // API 서버에서 이름을 가져와서 사용해야함
    const hangulToRoman: { [key: string]: string } = {
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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)

        // 포커스 해제
        const activeElement = document.activeElement as HTMLElement
        activeElement?.blur()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div
        ref={dropdownRef}
        className="relative inline-block w-full max-w-sm min-w-[200px] md:w-[217px]"
      >
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-full h-12 md:w-[217px] md:h-[48px] flex justify-between items-center px-4 py-3 rounded-md text-lg bg-white focus:outline-none 
    ${isOpen ? 'border-[#5534DA]' : 'border-[#D9D9D9]'} border`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm ${selectedUser.badgeColor}`}
            >
              {getInitial(selectedUser.name)}
            </div>
            <span className="truncate">{selectedUser.name}</span>
          </div>
          <Image
            src="/assets/image/arrow-down.svg"
            alt="Arrow Down"
            width={24}
            height={24}
            className={`transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <ul className="absolute z-10 mt-2 w-full border border-[#D9D9D9] bg-white rounded-md transition-all duration-300 origin-top md:w-[217px] max-h-60 overflow-y-auto">
            {users.map((user) => (
              <li
                key={user.id}
                onClick={() => handleSelect(user)}
                className="flex items-center gap-3 px-4 hover:bg-gray-100 cursor-pointer text-lg w-full h-12 md:h-[48px]"
              >
                {selectedUser.id === user.id ? (
                  <Image
                    src="/assets/image/check.svg"
                    alt="check"
                    width={22}
                    height={22}
                  />
                ) : (
                  <div className="w-[22px] h-[22px]" />
                )}
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm ${user.badgeColor}`}
                  >
                    {getInitial(user.name)}
                  </div>
                  <span className="truncate">{user.name}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
