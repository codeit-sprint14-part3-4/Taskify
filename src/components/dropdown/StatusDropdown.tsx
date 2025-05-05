import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'

import styles from './statusDropdown.module.css'
import { ColumnType } from '@/types/api/columns'

interface StatusDropdownProps {
  columnList: ColumnType[]
  value: ColumnType
  onChange: (column: ColumnType) => void
}

export default function StatusDropdown({
  columnList,
  value,
  onChange,
}: StatusDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const dropdownContainerRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    optionRefs.current = new Array(columnList.length).fill(null)
  }, [])

  const assignOptionRef = useCallback(
    (element: HTMLLIElement | null, index: number) => {
      if (element) optionRefs.current[index] = element
    },
    []
  )

  const handleStatusSelect = (column: ColumnType) => {
    onChange(column)
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
        setFocusedIndex((prev) => (prev + 1) % columnList.length)
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setFocusedIndex(
          (prev) => (prev - 1 + columnList.length) % columnList.length
        )
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        handleStatusSelect(columnList[focusedIndex])
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

  const isSelected = (column: ColumnType) => value.id === column.id

  return (
    <div ref={dropdownContainerRef} className={styles.container}>
      <button
        type="button"
        onClick={() => {
          setIsDropdownOpen((prev) => !prev)
          setFocusedIndex(columnList.findIndex((s) => s.id === value.id))
        }}
        className={`${styles.triggerButton} ${
          isDropdownOpen ? styles.open : styles.closed
        }`}
      >
        <div className={styles.selectedStatus}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>{value.title}</span>
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
          {columnList.map((column, index) => (
            <li
              key={column.id}
              ref={(el) => assignOptionRef(el, index)}
              onClick={() => handleStatusSelect(column)}
              className={`${styles.option} ${
                index === focusedIndex ? styles.focused : ''
              } ${isSelected(column) ? styles.selected : ''}`}
            >
              {isSelected(column) ? (
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
                <span className={styles.statusText}>{column.title}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
