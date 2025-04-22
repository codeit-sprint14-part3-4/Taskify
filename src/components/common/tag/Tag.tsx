import styles from './Tag.module.css'

interface TagProps {
  label: string
  color: 'tag-orange' | 'tag-pink' | 'tag-blue' | 'tag-green'
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
