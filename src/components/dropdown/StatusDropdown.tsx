import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

// API에서 상태 데이터를 받아와서 사용해야함
type Status = 'To Do' | 'On Progress' | 'Done'

interface StatusDropdownProps {
  value: Status
  onChange: (status: Status) => void
}

const statusOptions: Status[] = ['To Do', 'On Progress', 'Done']

export default function StatusDropdown({
  value,
  onChange,
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSelect = (status: Status) => {
    onChange(status)
    setIsOpen(false)
  }

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
    <div className="flex items-center justify-center min-h-screen">
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
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-[#F1E5FF] rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#5534DA]" />
              <span className="text-[#5534DA]">{value}</span>
            </div>
          </div>
          <Image
            src="/assets/image/arrow-down.svg"
            alt="Arrow Down"
            width={24}
            height={24}
            className={`transition-transform duration-300 ${
              isOpen ? 'rotate-180' : '' // 180도로 회전 시킴
            }`}
          />
        </button>

        {isOpen && (
          <ul className="absolute z-10 mt-2 w-full border border-[#D9D9D9] bg-white rounded-md transition-all duration-300 origin-top md:w-[217px] max-h-60 overflow-y-auto">
            {statusOptions.map((status) => (
              <li
                key={status}
                onClick={() => handleSelect(status)}
                className="flex items-center gap-3 px-4 hover:bg-gray-100 cursor-pointer text-lg w-full h-12 md:h-[48px]"
              >
                {value === status ? (
                  <Image
                    src="/assets/image/check.svg"
                    alt="check"
                    width={22}
                    height={22}
                  />
                ) : (
                  <div className="w-[22px] h-[22px]" />
                )}

                <div className="inline-flex items-center gap-2 px-3 py-2 bg-[#F1E5FF] rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#5534DA]" />
                  <span className="text-[#5534DA]">{status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
