import styles from './Tag.module.css'

interface TagProps {
  label: string
  color:
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
}

export default function Tag({ label, color }: TagProps) {
  return (
    <div
      className={`${styles.tag} ${
        styles[color as keyof typeof styles]
      } text-md-regular`}
    >
      {label}
    </div>
  )
}
