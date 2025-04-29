// 카드 리스트들
import Card from '@/components/domain/dashboard/Card'
import { CardType } from '@/types/api/cards'

interface CardTableProps {
  cards: CardType[]
}

export default function CardTable({ cards }: CardTableProps) {
  return (
    <div className="flex flex-col gap-4 px-[2rem]">
      {cards.map((card) => (
        <Card key={card.id} cardInfo={card} />
      ))}
    </div>
  )
}
