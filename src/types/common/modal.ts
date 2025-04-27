export type ModalSize = 'small' | 'large'

export type ModalProps = {
  message: string
  onConfirm: () => void
  onCancel?: () => void
  size?: ModalSize
  confirmLabel?: string
  cancelLabel?: string
}
