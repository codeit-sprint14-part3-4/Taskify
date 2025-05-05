// 카드 리스트들
import Card from '@/components/domain/dashboard/Card'
import { CardType } from '@/types/api/cards'
import { ColumnType } from '@/types/api/columns'
import { SetStateAction } from 'react'

interface CardTableProps {
  cards: CardType[]
  dashboardId: number
  columnInfo: ColumnType
  setRefreshTrigger: React.Dispatch<SetStateAction<number>>
}

export default function CardTable({
  cards,
  dashboardId,
  columnInfo,
  setRefreshTrigger,
}: CardTableProps) {
  return (
    <div className="flex flex-col gap-4 px-[2rem]">
      {cards.map((card) => (
        <Card
          key={card.id}
          cardInfo={card}
          dashboardId={dashboardId}
          columnInfo={columnInfo}
          setRefreshTrigger={setRefreshTrigger}
        />
      ))}
    </div>
  )
}
