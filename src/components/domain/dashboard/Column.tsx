import { useEffect, useState } from 'react'
import Image from 'next/image'
import CardTable from '@/components/domain/dashboard/CardTable'
import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import { cardsService } from '@/api/services/cardsServices'
import { ColumnType } from '@/types/api/columns'
import { CardType } from '@/types/api/cards'
import styles from './column.module.css'

export interface ColumnProps {
  columnInfo: ColumnType
  dashboardId: number
  handleCardCreateModalOpen: (columnId: number) => void
  // 아래 props가 실제로 존재하지 않는다면 제거하거나 대체 로직 필요
  handleColumnEditModal?: (open: boolean) => void
  handleColumnOptionClick?: (column: ColumnType) => void
}

export default function Column({
  columnInfo,
  dashboardId,
  handleCardCreateModalOpen,
  handleColumnEditModal,
  handleColumnOptionClick,
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
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <div className={styles.dotTitle}>
            <div className={styles.dot} />
            <span className="text-lg-medium">{columnInfo.title}</span>
          </div>

          <span className={styles.cardCount}>{cards && cards.length}</span>
        </div>

        {/* 설정 버튼 */}
        <button
          onClick={() => {
            handleColumnEditModal?.(true)
            handleColumnOptionClick?.(columnInfo)
          }}
        >
          <Image
            src="/assets/icon/settings-logo.svg"
            alt="설정 아이콘"
            width={24}
            height={24}
          />
        </button>
      </div>

      {/* 카드 리스트 */}
      {cards && (
        <CardTable
          cards={cards}
          dashboardId={dashboardId}
          columnInfo={{
            columnId: columnInfo.id,
            columnTitle: columnInfo.title,
          }}
        />
      )}
    </div>
  )
}
