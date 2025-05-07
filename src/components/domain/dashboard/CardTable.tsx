import { useRef, useEffect } from 'react'
import Card from '@/components/domain/dashboard/Card'
import { CardType } from '@/types/api/cards'
import { ColumnType } from '@/types/api/columns'
import { SetStateAction } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'

interface CardTableProps {
  cards: CardType[]
  dashboardId: number
  columnInfo: ColumnType
  setRefreshTrigger: React.Dispatch<SetStateAction<number>>
  onLoadMore?: () => void
  isLoading: boolean
  hasMore: boolean
}

export default function CardTable({
  cards,
  dashboardId,
  columnInfo,
  setRefreshTrigger,
  onLoadMore,
  isLoading,
  hasMore,
}: CardTableProps) {
  const observerRef = useRef<HTMLDivElement | null>(null)

  // 무한 스크롤 트리거용 IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading && onLoadMore) {
          onLoadMore()
        }
      },
      { threshold: 1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [hasMore, isLoading, onLoadMore])

  return (
    <Droppable droppableId={String(columnInfo.id)}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex flex-col gap-4 px-[2rem]"
        >
          {cards.length === 0 ? (
            <div className="text-gray-400 text-center py-4">
              등록된 카드가 없습니다.
            </div>
          ) : (
            cards.map((card, index) => (
              <Draggable
                key={card.id}
                draggableId={String(card.id)}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => console.log('카드 클릭')} // 필요시
                  >
                    <Card
                      cardInfo={card}
                      dashboardId={dashboardId}
                      columnInfo={columnInfo}
                      setRefreshTrigger={setRefreshTrigger}
                      index={index}
                    />
                  </div>
                )}
              </Draggable>
            ))
          )}
          {provided.placeholder}
          <div ref={observerRef} style={{ height: '10px' }} />
        </div>
      )}
    </Droppable>
  )
}
