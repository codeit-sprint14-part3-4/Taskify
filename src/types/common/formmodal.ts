export interface FormModalProps {
  title: string
  inputLabel: string
  inputValue: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCancel: () => void
  onDelete: () => void
  onEdit: () => void
  onCreate: () => void
  mode?: string
  errorMessage?: string
  size?: 'small' | 'large'
  confirmLabel?: string
  cancelLabel?: string
  showCloseButton?: boolean
}
