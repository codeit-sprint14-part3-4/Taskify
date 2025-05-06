import { useRef, useEffect } from 'react'
import Card from '@/components/domain/dashboard/Card'
import { CardType } from '@/types/api/cards'
import { ColumnType } from '@/types/api/columns'
import { SetStateAction } from 'react'

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
  // 관찰용 useEffectss
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
    <div className="flex flex-col gap-4 px-[2rem]">
      {cards.map((card, index) => (
        <div key={`${card.id}-${index}`}>
          <Card
            cardInfo={card}
            dashboardId={dashboardId}
            columnInfo={columnInfo}
            setRefreshTrigger={setRefreshTrigger}
          />
        </div>
      ))}

      <div ref={observerRef} style={{ height: '10px' }} />
    </div>
  )
}
