import styles from './ColorPin.module.css'
import ColorBadgeProps from '@/types/common/colorpin'

export default function ColorPin({
  // id,
  color,
  isSelected,
  onClick,
}: ColorBadgeProps) {
  return (
    <button
      // key={id}
      onClick={onClick}
      className={`${styles.color_pin} ${isSelected ? styles.selected : ''}`}
      style={{ backgroundColor: color }}
    >
      {isSelected && <span className={styles.check}>✓</span>}
    </button>
  )
}
