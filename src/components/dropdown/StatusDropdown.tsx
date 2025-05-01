import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import styles from './statusDropdown.module.css'

export enum Status {
  TODO = 'To Do',
  ON_PROGRESS = 'On Progress',
  DONE = 'Done',
  EXAMPLE = 'Example',
  REVIEW = 'Review',
}

interface StatusDropdownProps {
  value: Status
  onChange: (status: Status) => void
}

const statusOptions: Status[] = [
  Status.TODO,
  Status.ON_PROGRESS,
  Status.DONE,
  Status.EXAMPLE,
  Status.REVIEW,
]

export default function StatusDropdown({
  value,
  onChange,
}: StatusDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const dropdownContainerRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<(HTMLLIElement | null)[]>([])

  const assignOptionRef = useCallback(
    (element: HTMLLIElement | null, index: number) => {
      if (element) optionRefs.current[index] = element
    },
    []
  )

  const handleStatusSelect = (status: Status) => {
    onChange(status)
    setIsDropdownOpen(false)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isDropdownOpen) return

      if (event.key === 'Escape') {
        setIsDropdownOpen(false)
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
        handleStatusSelect(statusOptions[focusedIndex])
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen, focusedIndex])

  useEffect(() => {
    if (isDropdownOpen && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      })
    }
  }, [focusedIndex, isDropdownOpen])

  return (
    <div ref={dropdownContainerRef} className={styles.container}>
      <button
        type="button"
        onClick={() => {
          setIsDropdownOpen((prev) => !prev)
          setFocusedIndex(statusOptions.findIndex((s) => s === value))
        }}
        className={`${styles.triggerButton} ${
          isDropdownOpen ? styles.open : styles.closed
        }`}
      >
        <div className={styles.selectedStatus}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>{value}</span>
        </div>
        <Image
          src="/assets/image/arrow-down.svg"
          alt="Arrow Down"
          width={24}
          height={24}
          className={`${styles.arrowIcon} ${
            isDropdownOpen ? styles.rotate : ''
          }`}
        />
      </button>

      {isDropdownOpen && (
        <ul className={styles.dropdown}>
          {statusOptions.map((status, index) => (
            <li
              key={status}
              ref={(el) => assignOptionRef(el, index)}
              onClick={() => handleStatusSelect(status)}
              className={`${styles.option} ${
                index === focusedIndex ? styles.focused : ''
              } ${value === status ? styles.selected : ''}`}
            >
              {value === status ? (
                <Image
                  src="/assets/image/check.svg"
                  alt="선택됨"
                  width={22}
                  height={22}
                />
              ) : (
                <div className={styles.emptyBox} />
              )}
              <div className={styles.selectedStatus}>
                <span className={styles.statusDot} />
                <span className={styles.statusText}>{status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
