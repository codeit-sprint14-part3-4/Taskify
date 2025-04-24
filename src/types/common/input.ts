export default interface InputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  error?: string
  className?: string
  paddingwidth?: string
  paddingheight?: string
  icon?: React.ReactNode
  width?: string
}
