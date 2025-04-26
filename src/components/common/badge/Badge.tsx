import styles from './badge.module.css'
import type { TagProps } from '@/types/common/tag'

export default function Badge({ label, color }: TagProps) {
  return (
    <div
      className={`${styles.tag} ${
        styles[color as keyof typeof styles]
      } text-md-regular`}
    >
      {label}
    </div>
  )
}
