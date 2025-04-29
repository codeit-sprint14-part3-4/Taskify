import Image from 'next/image'
import styles from './Tag.module.css'
import type { TagProps } from '@/types/common/tag'

interface ExtendedTagProps extends TagProps {
  isDeletable?: boolean
  onDelete?: () => void
}

export default function Tag({
  label,
  color,
  isDeletable = false,
  onDelete,
}: ExtendedTagProps) {
  return (
    <div
      className={`${styles.tag} ${
        styles[color as keyof typeof styles]
      } text-md-regular relative`}
    >
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
