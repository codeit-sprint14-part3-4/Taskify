type BaseProps = {
  title: string
  inputLabel: string
  inputValue: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCancel: () => void
  errorMessage?: string
  size?: 'small' | 'large'
  cancelLabel?: string
  showCloseButton?: boolean
}

// 생성 모드
type CreateModalProps = BaseProps & {
  mode?: 'default' // 생략해도 기본값으로 default
  onCreate: () => void
}

// 삭제 + 변경 모드
type DeleteEditModalProps = BaseProps & {
  mode: 'delete'
  onDelete: () => void
  onEdit: () => void
}

export type FormModalProps = CreateModalProps | DeleteEditModalProps
