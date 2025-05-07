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
  index: number
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
      <div className={styles.card} onClick={() => handleCardDetailModal(true)}>
        <div
          className={`${styles.cardInner} ${
            !cardInfo.imageUrl ? styles.noImage : ''
          }`}
        >
          {cardInfo.imageUrl && (
            <div className={styles.imageWrapper}>
              <Image
                src={cardInfo.imageUrl}
                alt="카드 이미지"
                className={styles.image}
                width={500}
                height={100}
              />
            </div>
          )}

          <div className={styles.content}>
            <h4
              className="text-lg-medium text-start"
              style={{ color: 'var(--black-333236)' }}
            >
              {cardInfo.title}
            </h4>

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
                <span>{cardInfo.dueDate}</span>
              </div>

              <div className={styles.assigneeSection}>
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
        </div>
      </div>

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
