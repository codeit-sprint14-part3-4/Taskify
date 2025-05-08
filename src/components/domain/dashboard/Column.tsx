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

  const getCards = useCallback(async () => {
    setIsLoading(true)
    setHasMore(true)

    try {
      const res = await cardsService.getCards(5, columnInfo.id, undefined)
      setCards(res.cards) // 정렬 없이 그대로 사용

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

      // 기존 카드에 새로운 카드 추가
      const mergedCards = [...cards, ...res.cards] // 기존 카드 순서 유지

      setCards(mergedCards)

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

    getCards()

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
          <div className={styles.card_scroll}>
            <CardTable
              cards={cards}
              dashboardId={dashboardId}
              columnInfo={columnInfo}
              setRefreshTrigger={setRefreshTrigger}
              onLoadMore={loadMoreCards}
              isLoading={isLoading}
              hasMore={hasMore}
            />
          </div>
          <div
            ref={observerRef}
            style={{ height: '10px', backgroundColor: 'transparent' }}
          />
        </>
      )}
    </div>
  )
}
