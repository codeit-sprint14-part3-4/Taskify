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

  useEffect(() => {
    if (!observerRef.current || !onLoadMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading && hasMore) {
          console.log('[IntersectionObserver] 트리거됨 - onLoadMore 호출')
          onLoadMore() // 여기에서 데이터를 불러옵니다
        }
      },
      {
        rootMargin: '100px', // 마지막 카드가 화면에 보일 때 트리거
      }
    )

    observer.observe(observerRef.current)

    return () => observer.disconnect()
  }, [onLoadMore, isLoading, hasMore])

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
      <div ref={observerRef} /> {/* 마지막 카드 감지용 div */}
    </div>
  )
}
