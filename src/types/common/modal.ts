export type ModalSize = 'small' | 'large'

export type ModalProps = {
  message: string
  onConfirm: () => void
  onCancel?: () => void
  onDelete?: () => void
  size?: ModalSize
  confirmLabel?: string
  cancelLabel?: string
  deleteLabel?: string
}
