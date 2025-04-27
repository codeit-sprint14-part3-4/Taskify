import { useEffect, useState } from 'react'
import styles from './Badge.module.css'

interface BadgeProps {
  email: string
}

const getRandomColor = () => {
  const colors = [
    '#f7dbdb',
    '#f9eee3',
    '#fef7db',
    '#e7f7db',
    '#dbe6f7',
    '#e8dbf7',
    '#f7dbf0',
    '#dbf7f3',
    '#f2e6db',
    '#f0f0f0',
  ]
  const randomIndex = Math.floor(Math.random() * colors.length)
  return colors[randomIndex]
}

const Badge = ({ email }: BadgeProps) => {
  const [bgColor, setBgColor] = useState<string>('')

  useEffect(() => {
    setBgColor(getRandomColor())
  }, [])

  const getFirstLetter = (email: string) => {
    const firstLetter = email?.charAt(0)?.toUpperCase() || ''
    return firstLetter
  }

  return (
    <div className={styles.badgeWrapper}>
      <div className={styles.badge} style={{ backgroundColor: bgColor }}>
        {getFirstLetter(email)}
      </div>
    </div>
  )
}

export default Badge
