export type TagColor =
  | 'tag-orange'
  | 'tag-pink'
  | 'tag-blue'
  | 'tag-green'
  | 'tag-purple'
  | 'tag-yellow'
  | 'tag-red'
  | 'tag-teal'
  | 'tag-brown'
  | 'tag-gray'

export interface TagProps {
  label: string
  // color: TagColor
  isDeletable?: boolean
  onDelete?: () => void
}
