// 카드 리스트들
import Card, { CardInfo } from '@/components/domain/dashboard/Card'

interface CardTableProps {
  cards: CardInfo[]
}

export default function CardTable({ cards }: CardTableProps) {
  return (
    <div className="flex flex-col gap-4 px-[20px] py-[8px]">
      {cards.map((card) => (
        <Card key={card.id} cardInfo={card} />
      ))}
    </div>
  )
}
