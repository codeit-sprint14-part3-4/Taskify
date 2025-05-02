import { useEffect, useState } from 'react'
import styles from './Badge.module.css'

interface BadgeProps {
  nickname: string
  profileImage?: string
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

const Badge = ({ nickname, profileImage }: BadgeProps) => {
  const [bgColor, setBgColor] = useState<string>('')

  // 랜덤 배경색 설정
  useEffect(() => {
    if (!profileImage) {
      setBgColor(getRandomColor()) // 프로필 이미지가 없을 때만 랜덤 배경 색상
    }
  }, [profileImage])

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
          {getFirstLetter(nickname)} {/* 첫 글자를 표시 */}
        </div>
      )}
    </div>
  )
}

export default Badge
