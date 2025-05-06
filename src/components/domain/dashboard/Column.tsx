import { SetStateAction, useEffect, useState } from 'react'
import Image from 'next/image'
import CardTable from '@/components/domain/dashboard/CardTable'
import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import { cardsService } from '@/api/services/cardsServices'
import { ColumnType } from '@/types/api/columns'
import { CardType } from '@/types/api/cards'
import styles from './column.module.css'

// 내부에서만 사용
export interface ColumnProps {
  columnInfo: ColumnType
  dashboardId: number
  refreshTrigger: number
  setRefreshTrigger: React.Dispatch<SetStateAction<number>>
  handleCardCreateModalOpen: (columnId: number) => void
  handleColumnEditModal: (state: boolean) => void
  handleColumnOptionClick: (columnInfo: ColumnType) => void
}

export default function Column({
  columnInfo,
  dashboardId,
  setRefreshTrigger,
  handleCardCreateModalOpen,
  handleColumnEditModal,
  handleColumnOptionClick,
}: ColumnProps) {
  const [cards, setCards] = useState<CardType[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const getCards = async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)

    try {
      console.log('[getCards] 호출됨 - page:', page, 'columnId:', columnInfo.id)

      const res = await cardsService.getCards(3, columnInfo.id, page)

      console.log('[getCards] 응답 데이터:', res)
      console.log('[getCards] 받아온 카드 개수:', res.cards.length)
      console.log('[getCards] 전체 카드 수 (totalCount):', res.totalCount)

      const prevIds = new Set(cards.map((card) => card.id))
      const newCards = res.cards.filter((card) => !prevIds.has(card.id))

      // 새로운 카드가 없을 경우에는 더 이상 불러올 카드가 없다고 설정
      if (newCards.length === 0) {
        console.log('[getCards] 새로운 카드 없음 - hasMore false 설정')
        setHasMore(false)
        return
      }

      // 받아온 카드를 기존 카드 목록에 추가
      setCards((prevCards) => {
        const updatedCards = [...prevCards, ...newCards]
        console.log('[getCards] 누적된 카드 개수:', updatedCards.length)
        return updatedCards
      })

      // cursorId가 없으면 더 이상 불러올 데이터가 없다는 의미
      if (!res.cursorId) {
        console.log('[getCards] 모든 카드 로드 완료 - hasMore false 설정')
        setHasMore(false)
      }

      setPage((prev) => prev + 1)
    } catch (e) {
      console.error('[getCards] 에러 발생:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMoreCards = () => {
    if (!hasMore || isLoading) {
      console.log(
        '[loadMoreCards] 무시됨 - hasMore:',
        hasMore,
        'isLoading:',
        isLoading
      )
      return
    }
    getCards()
  }

  // 초기 로딩
  useEffect(() => {
    getCards()
  }, [])

  return (
    <div className={styles.column}>
      {/* 상단: 컬럼 제목 + 카드 개수 + 설정 버튼 */}
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <div className={styles.dotTitle}>
            <div className={styles.dot} />
            <span className="text-lg-medium">{columnInfo.title}</span>
          </div>
          <span className={styles.cardCount}>{cards && cards.length}</span>
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
                style={{
                  width: '2.2rem',
                  height: '2.2rem',
                  display: 'block',
                }}
              />
            </div>
          }
        />
      </div>

      <div className={styles.card_list}>
        {/* 카드 리스트 */}
        {cards && (
          <CardTable
            cards={cards}
            dashboardId={dashboardId}
            columnInfo={columnInfo}
            setRefreshTrigger={setRefreshTrigger}
            onLoadMore={loadMoreCards}
            isLoading={isLoading}
            hasMore={hasMore}
          />
        )}
      </div>
    </div>
  )
}
