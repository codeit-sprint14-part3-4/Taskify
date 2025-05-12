import Image from 'next/image'
import styles from './tag.module.css'
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

function getTagColorFromLabel(label: string): TagColor {
  let hash = 0
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % TAG_COLORS.length
  return TAG_COLORS[index]
}

interface ExtendedTagProps extends TagProps {
  isDeletable?: boolean
  onDelete?: () => void
  color?: TagColor
}

export default function Tag({
  label,
  isDeletable = false,
  onDelete,
  color,
}: ExtendedTagProps) {
  const tagColor = useMemo(() => {
    return color ?? getTagColorFromLabel(label)
  }, [label, color])

  return (
    <div
      className={`${styles.tag} ${styles[tagColor]} text-md-regular relative ${
        isDeletable ? `${styles['tag-hover']} ${styles['tag-active']}` : ''
      }`}
    >
      {label}
      {isDeletable && (
        <button
          type="button"
          onClick={onDelete}
          className="ml-[0.2rem] flex items-center justify-center cursor-pointer"
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
