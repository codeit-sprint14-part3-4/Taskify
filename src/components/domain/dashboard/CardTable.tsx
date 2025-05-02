import { useState } from 'react'
import Card from './Card'
import TaskCardModal from '@/components/domain/modals/taskcardmodal/TaskCardModal'
import { CardType } from '@/types/api/cards'

interface CardTableProps {
  cards: CardType[]
}

export default function CardTable({ cards }: CardTableProps) {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null)

  const handleCardClick = (card: CardType) => {
    // ✅ assignee 누락 시 기본값 보정
    const completeCard: CardType = {
      ...card,
      assignee: card.assignee ?? {
        id: 0,
        nickname: '알 수 없음',
        profileImageUrl: '/assets/icon/default-profile.svg',
      },
    }

    setSelectedCard(completeCard)
  }

  return (
    <div className="flex flex-col gap-4 px-[2rem]">
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => handleCardClick(card)}
          className="cursor-pointer"
        >
          <Card cardInfo={card} />
        </div>
      ))}

      {selectedCard && (
        <TaskCardModal
          cardId={selectedCard.id}
          currentUserId={1}
          onClose={() => setSelectedCard(null)}
          onEdit={(updated) => console.log('수정됨:', updated)}
          onDelete={(id) => setSelectedCard(null)}
        />
      )}
    </div>
  )
}
