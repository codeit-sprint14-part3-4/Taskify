import styles from './pagination.module.css'
import Image from 'next/image'
import { PaginationProps } from '@/types/common/pagination'

export default function Pagination({
  current,
  total,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, total)

  const handleNext = () => {
    if (current < totalPages) {
      onPageChange(current + 1)
    }
  }

  const handlePrev = () => {
    if (current > 1) {
      onPageChange(current - 1)
    }
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.page_text} text-md-regular`}>
        {current} / {totalPages}
      </div>
      <div className={styles.arrowButtons}>
        <button
          onClick={handlePrev}
          disabled={current === 1}
          className={styles.pageButton}
        >
          <Image
            className={styles.page_button_image}
            src="/assets/image/arrow-left-bold.svg"
            width={16}
            height={16}
            alt="왼쪽 화살표"
          />
        </button>
        <button
          onClick={handleNext}
          disabled={current === totalPages}
          className={styles.pageButton}
        >
          <Image
            className={styles.page_button_image}
            src="/assets/image/arrow-right-bold.svg"
            width={16}
            height={16}
            alt="오른쪽 화살표"
          />
        </button>
      </div>
    </div>
  )
}
