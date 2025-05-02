import Column from './Column'
import { ColumnType } from '@/types/api/columns'
import type { CardType } from '@/types/api/cards'
import { useEffect, useState } from 'react'
import { cardsService } from '@/api/services/cardsServices'
import CardTable from './CardTable'

interface ColumnWrapperProps {
  columnInfo: ColumnType
  handleCardCreateModalOpen: (columnId: number) => void
}

export default function ColumnWrapper({
  columnInfo,
  handleCardCreateModalOpen,
}: ColumnWrapperProps) {
  const [cards, setCards] = useState<CardType[]>([])

  const handleColumnFixModalOpen = (columnId: number) => {
    console.log('컬럼 수정 모달 열기:', columnId)
  }

  useEffect(() => {
    const fetchCards = async () => {
      const data = await cardsService.getCards(10, columnInfo.id)
      setCards(data.cards)
    }
    fetchCards()
  }, [columnInfo.id])

  return (
    <div>
      <Column
        columnInfo={columnInfo}
        handleCardCreateModalOpen={handleCardCreateModalOpen}
        handleColumnFixModalOpen={handleColumnFixModalOpen}
      />
      <CardTable cards={cards} />
    </div>
  )
}
