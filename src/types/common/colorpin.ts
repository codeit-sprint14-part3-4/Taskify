export default interface ColorBadgeProps {
  id: number
  color: string
  isSelected: boolean
  onClick: () => void
  className?: string
  width?: string | number
  height?: string | number
}
