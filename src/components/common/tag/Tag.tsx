import Image from 'next/image'
import styles from './Tag.module.css'
import type { TagColor, TagProps } from '@/types/common/tag'
import { useMemo } from 'react'

const TAG_COLORS: TagColor[] = [
  'tag-orange',
  'tag-pink',
  'tag-blue',
  'tag-green',
  'tag-purple',
  'tag-yellow',
  'tag-red',
  'tag-teal',
  'tag-brown',
  'tag-gray',
]

function getRandomTagColor(): TagColor {
  const randomIndex = Math.floor(Math.random() * TAG_COLORS.length)
  return TAG_COLORS[randomIndex]
}

interface ExtendedTagProps extends TagProps {
  isDeletable?: boolean
  onDelete?: () => void
}

export default function Tag({
  label,
  // color,
  isDeletable = false,
  onDelete,
}: ExtendedTagProps) {
  // 💡 컴포넌트 생성 시 1회만 랜덤 색 고정
  const color = useMemo(() => getRandomTagColor(), [])

  return (
    <div className={`${styles.tag} ${styles[color]} text-md-regular relative`}>
      {label}
      {isDeletable && (
        <button
          type="button"
          onClick={onDelete}
          className="ml-[0.2rem] flex items-center justify-center"
        >
          <Image
            src="/assets/image/close.svg"
            alt="태그 삭제"
            width={12}
            height={12}
          />
        </button>
      )}
    </div>
  )
}
