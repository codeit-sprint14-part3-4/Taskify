import { useEffect, useState } from 'react'
import Image from 'next/image'
import CardTable from '@/components/domain/dashboard/CardTable'
import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import { cardsService } from '@/api/services/cardsServices'
import { ColumnType } from '@/types/api/columns'
import { CardType } from '@/types/api/cards'
import styles from './column.module.css'

// 내부에서만 사용
export interface ColumnProps {
  columnInfo: ColumnType
  handleCardCreateModalOpen: (columnId: number) => void
}

export default function Column({
  columnInfo,
  handleCardCreateModalOpen,
}: ColumnProps) {
  const [cards, setCards] = useState<CardType[]>()

  const getCards = async () => {
    const cardsData = await cardsService.getCards(10, columnInfo.id)
    setCards(cardsData.cards)
  }

  useEffect(() => {
    getCards()
  }, [])

  return (
    <div className={styles.column}>
      {/* 상단: 컬럼 제목 + 카드 개수 + 설정 버튼 */}
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <div className={styles.dotTitle}>
            <div className={styles.dot} />
            <span className="text-lg-medium">{columnInfo.title}</span>
          </div>

          <span className={styles.cardCount}>
            {/* && 연산자 사용 이유 : getCards는 비동기로 동작, cards가 확정적으로 동작하지 않음. cards가 있을 때만 cards.length가 동작할 수 있게 */}
            {cards && cards.length}
          </span>
        </div>

        {/* onClick 이벤트 추가 요망 */}
        <button>
          <Image
            src="/assets/icon/settings-logo.svg"
            alt="설정 아이콘"
            width={24}
            height={24}
          />
        </button>
      </div>

      {/* + 버튼 */}
      <div className={styles.addButtonWrapper}>
        <ButtonDashboard
          // onclickAdd 이벤트 추가 요망
          onClick={() => handleCardCreateModalOpen(columnInfo.id)}
          color="bg-white"
          className={styles.addButton}
          prefix={
            <div className={styles.addIcon}>
              <Image
                src="/assets/icon/add-box.svg"
                alt="카드 추가 버튼"
                width={22}
                height={22}
                unoptimized
                style={{ width: '22px', height: '22px', display: 'block' }}
              />
            </div>
          }
        />
      </div>

      {/* 카드 리스트 */}
      {cards && <CardTable cards={cards} />}
    </div>
  )
}
