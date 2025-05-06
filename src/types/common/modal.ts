export type ModalSize = 'small' | 'large'

export interface ModalProps {
  message: string
  onCancel: () => void
  onDelete: () => void
  cancelLabel?: string
  deleteLabel?: string

  size?: 'small' | 'large'
}
