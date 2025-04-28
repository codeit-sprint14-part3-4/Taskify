import { useEffect, useState } from 'react'
import styles from './Badge.module.css'

interface BadgeProps {
  email: string
}

const getRandomColor = () => {
  const colors = [
    '#FFC85A',
    '#FDD446',
    '#9DD7ED',
    '#C4B1A2',
    '#F4D7DA',
    '#A3C4A2',
    '#FF787A',
    '#F4BEFF',
    '#BEC3FF',
    '#BF57B5',
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
