import styles from './colorPin.module.css'
import ColorBadgeProps from '@/types/common/colorpin'

export default function ColorPin({
  id,
  color,
  isSelected,
  onClick,
  width,
  height,
}: ColorBadgeProps) {
  return (
    <button
      key={id}
      onClick={onClick}
      className={`${styles.color_pin} ${isSelected ? styles.selected : ''}`}
      style={{ backgroundColor: color, width, height }}
    >
      {isSelected && <span className={styles.check}>✓</span>}
    </button>
  )
}
