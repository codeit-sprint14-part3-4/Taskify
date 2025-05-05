import Image from 'next/image'
import styles from './pagination.module.css'
import ArrowLeft from '../../../../public/assets/icon/arrow-left-gray.svg'
import ArrowRight from '../../../../public/assets/icon/arrow-right-gray.svg'
import { PaginationProps } from '@/types/common/pagination'

export default function Pagination({
  current,
  total,
  onPageChange,
}: PaginationProps) {
  const handleNext = () => {
    if (current < total) {
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
      <div className="text-md-regular">
        {current} 페이지 중 {total}
      </div>
      <div className={styles.arrowButtons}>
        <button
          onClick={handlePrev}
          disabled={current === 1}
          className={styles.image_container}
        >
          <Image src={ArrowLeft} alt="이전 페이지" width={7} height={7} />
        </button>
        <button
          onClick={handleNext}
          disabled={current === total}
          className={styles.image_container}
        >
          <Image src={ArrowRight} alt="다음 페이지" width={7} height={7} />
        </button>
      </div>
    </div>
  )
}
