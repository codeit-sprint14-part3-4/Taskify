import Image from 'next/image'
import { SetStateAction, useState } from 'react'

import { cardsService } from '@/api/services/cardsServices'
import Tag from '@/components/common/tag/Tag' // 개별 카드
import Badge from '@/components/common/badge/Badge'
import TaskCardModal from '../modals/taskcardmodal/TaskCardModal'
import TaskCardEditModal from '../modals/taskcardeditmodal/TaskCardEditModal'
import { CardType } from '@/types/api/cards'
import styles from './card.module.css'
import { ColumnType } from '@/types/api/columns'

// 내부에서만 사용
export interface CardProps {
  cardInfo: CardType
  dashboardId: number
  columnInfo: ColumnType
  setRefreshTrigger: React.Dispatch<SetStateAction<number>>
}

export default function Card({
  cardInfo,
  dashboardId,
  columnInfo,
  setRefreshTrigger,
}: CardProps) {
  const [isCardDetailModal, setIsCardDetailModal] = useState(false)
  const [isCardEditModal, setIsCardEditModal] = useState(false)

  const handleCardDetailModal = (state: boolean) => {
    if (state) setIsCardDetailModal(state)
    else setIsCardDetailModal(false)
  }

  const handleCardEditModal = (state: boolean) => {
    if (state) setIsCardEditModal(state)
    else setIsCardEditModal(false)
  }

  const deleteCard = async (cardId: number) => {
    await cardsService.deleteCards(cardId)
    setRefreshTrigger((prev) => prev + 1)
    setIsCardDetailModal(false)
  }

  return (
    <>
      <button
        className={styles.card}
        onClick={() => handleCardDetailModal(true)}
      >
        {/* 이미지: 현재 props로 받은 imageUrl 사용,
      추후 카드 상세 모달에서 이미지 업로드 API 연동 예정 */}
        {cardInfo.imageUrl && (
          <div className={styles.imageWrapper}>
            <Image
              src={cardInfo.imageUrl}
              alt="카드 이미지"
              className={styles.image}
              width={500}
              height={0}
            />
          </div>
        )}

        <div className={styles.content}>
          {/* 제목: 현재는 title props 그대로 사용,
        추후 모달에서 수정 가능한 입력 필드로 연동 예정 */}
          <h4
            className="text-lg-medium text-start"
            style={{ color: 'var(--black-333236)' }}
          >
            {cardInfo.title}
          </h4>

          {/* 태그 리스트: 랜덤 스타일 태그 사용 중,
        추후 모달에서 태그 추가/삭제 및 색상 재지정 연동 예정*/}
          <div className={styles.tagList}>
            {cardInfo.tags.map((tag, index) => (
              <Tag key={index} label={tag} />
            ))}
          </div>

          <div className={styles.meta}>
            <div className={styles.dateSection}>
              <Image
                src="/assets/icon/calendar.svg"
                alt="달력 아이콘"
                width={18}
                height={18}
                className={styles.calendarIcon}
              />
              {/* 날짜는 string으로 받은 값 (ex: '2025-12-31')이며,
            추후 카드 상세 모달에서 Date 객체로 변환하여 처리할 예정 */}
              <span>{cardInfo.dueDate}</span>
            </div>

            <div className={styles.assigneeSection}>
              {/* 추후 assignee.profileImageUrl로 프로필 이미지 표시 예정
              현재는 nickname 텍스트만 출력 중 */}
              {/* assignee에 프로필 이미지가 추가 안된 상태여서 에러가 나는 상황 */}
              {cardInfo.assignee &&
                (cardInfo.assignee.profileImageUrl ? (
                  <Image
                    src={cardInfo.assignee.profileImageUrl}
                    alt="프로필 이미지"
                    width={24}
                    height={24}
                    className="w-[2.4rem] h-[2.4rem] rounded-full object-cover"
                  />
                ) : (
                  <Badge nickname={cardInfo.assignee.nickname} />
                ))}
            </div>
          </div>
        </div>
      </button>
      {isCardDetailModal && (
        <TaskCardModal
          card={cardInfo}
          dashboardId={dashboardId}
          columnInfo={columnInfo}
          onClose={() => handleCardDetailModal(false)}
          onEdit={() => handleCardEditModal(true)}
          onDelete={() => {
            deleteCard(cardInfo.id)
          }}
        />
      )}
      {isCardEditModal && (
        <TaskCardEditModal
          cardInfo={cardInfo}
          dashboardId={dashboardId}
          columnInfo={columnInfo}
          handleCardEditModal={handleCardEditModal}
          setRefreshTrigger={setRefreshTrigger}
        />
      )}
    </>
  )
}
