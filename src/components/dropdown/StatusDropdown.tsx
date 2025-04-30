import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'

export enum Status {
  TODO = 'To Do',
  ON_PROGRESS = 'On Progress',
  DONE = 'Done',
}

interface StatusDropdownProps {
  value: Status
  onChange: (status: Status) => void
}

const statusOptions: Status[] = [Status.TODO, Status.ON_PROGRESS, Status.DONE]

export default function StatusDropdown({
  value,
  onChange,
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const setItemRef = useCallback((el: HTMLLIElement | null, index: number) => {
    if (el) itemRefs.current[index] = el
  }, [])

  const handleSelect = (status: Status) => {
    onChange(status)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      if (event.key === 'Escape') {
        setIsOpen(false)
        const activeElement = document.activeElement as HTMLElement
        activeElement?.blur()
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setFocusedIndex((prev) => (prev + 1) % statusOptions.length)
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setFocusedIndex(
          (prev) => (prev - 1 + statusOptions.length) % statusOptions.length
        )
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        handleSelect(statusOptions[focusedIndex])
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, focusedIndex])

  useEffect(() => {
    if (isOpen && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      })
    }
  }, [focusedIndex, isOpen])

  return (
    <div
      ref={dropdownRef}
      className="relative w-full max-w-sm min-w-[20rem] md:w-[21.7rem]"
    >
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev)
          setFocusedIndex(statusOptions.findIndex((s) => s === value))
        }}
        className={`w-full h-[4.8rem] flex justify-between items-center px-[1.6rem] rounded-[0.8rem] text-[1.4rem] font-medium bg-[var(--white-FFFFFF)] border ${
          isOpen
            ? 'border-[var(--violet-5534DhA)]'
            : 'border-[var(--gray-D9D9D9)]'
        } focus:outline-none transition-colors duration-200`}
      >
        <div className="flex items-center gap-[1.2rem]">
          <div className="inline-flex items-center gap-[0.8rem] px-[1.2rem] py-[0.8rem] bg-[rgba(85,52,218,0.08)] rounded-full">
            <span className="w-[0.8rem] h-[0.8rem] rounded-full bg-[#5534DA]" />
            <span className="text-[#5534DA]">{value}</span>
          </div>
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
        <ul className="absolute z-10 mt-[0.8rem] w-full border border-[#D9D9D9] bg-[var(--white-FFFFFF)] rounded-[0.8rem] transition-all duration-300 origin-top max-h-[24rem] overflow-y-auto">
          {statusOptions.map((status, index) => (
            <li
              key={`status-${index}`}
              ref={(el) => setItemRef(el, index)}
              onClick={() => handleSelect(status)}
              className={`flex items-center gap-[1.2rem] px-[1.6rem] cursor-pointer w-full h-[4.8rem] text-[1.4rem] font-medium transition-colors duration-200 ${
                index === focusedIndex
                  ? 'bg-gray-200'
                  : value === status
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-100'
              }`}
            >
              {value === status ? (
                <Image
                  src="/assets/image/check.svg"
                  alt="선택됨"
                  width={22}
                  height={22}
                />
              ) : (
                <div className="w-[2.2rem] h-[2.2rem]" />
              )}
              <div className="inline-flex items-center gap-[0.8rem] px-[1.2rem] py-[0.8rem] bg-[rgba(85,52,218,0.08)] rounded-full">
                <span className="w-[0.8rem] h-[0.8rem] rounded-full bg-[#5534DA]" />
                <span className="text-[#5534DA]">{status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
