import { useEffect, useState } from 'react'
import styles from './badge.module.css'

interface BadgeProps {
  nickname: string
  profileImage?: string
}

const COLORS = [
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

const Badge = ({ nickname, profileImage }: BadgeProps) => {
  const [bgColor, setBgColor] = useState<string>('')

  // 고정된 색상 가져오기 함수
  const getBadgeColor = (nickname: string): string => {
    const key = `badgeColor_${nickname}`
    const savedColor = localStorage.getItem(key)
    if (savedColor && COLORS.includes(savedColor)) {
      return savedColor
    } else {
      const hash = [...nickname].reduce(
        (acc, char) => acc + char.charCodeAt(0),
        0
      )
      const color = COLORS[hash % COLORS.length]
      localStorage.setItem(key, color)
      return color
    }
  }

  useEffect(() => {
    if (!profileImage) {
      const color = getBadgeColor(nickname)
      setBgColor(color)
    }
  }, [profileImage, nickname])

  // 닉네임 첫 글자 반환
  const getFirstLetter = (nickname: string) => {
    return nickname?.charAt(0)?.toUpperCase() || ''
  }

  return (
    <div className={styles.badgeWrapper}>
      {profileImage ? (
        <img
          src={profileImage}
          alt={`${nickname}'s profile`}
          className={styles.profileImage}
        />
      ) : (
        <div className={styles.badge} style={{ backgroundColor: bgColor }}>
          {getFirstLetter(nickname)}
        </div>
      )}
    </div>
  )
}

export default Badge
