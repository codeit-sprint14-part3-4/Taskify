import { SetStateAction, useEffect, useRef, useState, useCallback } from 'react'
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
  refreshTrigger: number
  setRefreshTrigger: React.Dispatch<SetStateAction<number>>
  handleCardCreateModalOpen: (columnId: number) => void
  handleColumnEditModal: (state: boolean) => void
  handleColumnOptionClick: (columnInfo: ColumnType) => void
  handleDeleteColumnConfirm: (column: ColumnType) => void
}

export default function Column({
  columnInfo,
  dashboardId,
  refreshTrigger,
  setRefreshTrigger,
  handleCardCreateModalOpen,
  handleColumnEditModal,
  handleColumnOptionClick,
}: ColumnProps) {
  const [cards, setCards] = useState<CardType[]>([])
  const [cursorId, setCursorId] = useState<number | undefined>(undefined)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const observerRef = useRef<HTMLDivElement | null>(null)

  // 카드 생성일 기준으로 최신순 정렬하는 함수
  const sortCardsByCreatedAt = (cards: CardType[]) => {
    return cards.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  const getCards = useCallback(async () => {
    setIsLoading(true)
    setCursorId(undefined)
    setHasMore(true)

    try {
      const res = await cardsService.getCards(5, columnInfo.id, undefined)
      const sortedCards = sortCardsByCreatedAt(res.cards) // 복사된 배열 기준 정렬
      setCards(sortedCards) // reverse 제거!

      if (!res.cursorId || res.cards.length === 0) {
        setHasMore(false)
      } else {
        setCursorId(res.cursorId)
      }
    } catch (e) {
      console.error('[getCards] 에러:', e)
    } finally {
      setIsLoading(false)
    }
  }, [columnInfo.id])

  const loadMoreCards = async () => {
    if (!hasMore || isLoading) return
    setIsLoading(true)

    try {
      const res = await cardsService.getCards(5, columnInfo.id, cursorId)

      const newCards = sortCardsByCreatedAt(res.cards)

      // 중복 제거
      const mergedCards = [...cards, ...newCards]
      const uniqueCards = Array.from(
        new Map(mergedCards.map((card) => [card.id, card])).values()
      )

      setCards(uniqueCards)

      if (!res.cursorId || res.cards.length === 0) {
        setHasMore(false)
      } else {
        setCursorId(res.cursorId)
      }
    } catch (e) {
      console.error('[loadMoreCards] 에러:', e)
    } finally {
      setIsLoading(false)
    }
  }

  // 초기 로딩
  useEffect(() => {
    const fetchCards = async () => {
      const res = await cardsService.getCards(5, columnInfo.id, undefined)
      console.log('정렬 전', res.cards)

      const sortedCards = sortCardsByCreatedAt(res.cards)
      console.log('정렬 후', sortedCards)

      setCards(sortedCards)
    }

    fetchCards()
  }, [refreshTrigger, getCards])

  // 무한 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.documentElement
      if (
        scrollContainer.scrollTop + window.innerHeight >=
        scrollContainer.scrollHeight - 50
      ) {
        loadMoreCards()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMore, isLoading])

  return (
    <div className={styles.column}>
      {/* 상단: 컬럼 제목 + 카드 개수 + 설정 버튼 */}
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <div className={styles.dotTitle}>
            <div className={styles.dot} />
            <span className="text-lg-medium">{columnInfo.title}</span>
          </div>
          <span className={styles.cardCount}>{cards.length}</span>
        </div>
        <button
          onClick={() => {
            handleColumnEditModal(true)
            handleColumnOptionClick(columnInfo)
          }}
          className={styles.settingsButton}
        >
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
                style={{ width: '2.2rem', height: '2.2rem', display: 'block' }}
              />
            </div>
          }
        />
      </div>
      {cards && (
        <>
          <CardTable
            cards={cards}
            dashboardId={dashboardId}
            columnInfo={columnInfo}
            setRefreshTrigger={setRefreshTrigger}
            onLoadMore={loadMoreCards}
            isLoading={isLoading}
            hasMore={hasMore}
          />

          <div
            ref={observerRef}
            style={{ height: '10px', backgroundColor: 'transparent' }}
          />
        </>
      )}
    </div>
  )
}
