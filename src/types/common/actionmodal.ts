export interface Actionmodal {
  message: string
  onConfirm: () => void
  size?: 'small' | 'large'
  confirmLabel?: string
}
