export interface FormModalProps {
  title: string
  inputLabel: string
  inputValue: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onConfirm: () => void
  onCancel: () => void
  errorMessage?: string
  size?: 'small' | 'large'
  confirmLabel?: string
  cancelLabel?: string
  showCloseButton?: boolean
}
