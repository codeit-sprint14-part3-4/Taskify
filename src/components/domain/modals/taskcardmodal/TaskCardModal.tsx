import { useState, useEffect } from 'react'
import Image from 'next/image'
import Tag from '@/components/common/tag/Tag'
import Badge from '@/components/common/badge/Badge'
import { commentsService } from '@/api/services/commentsServices'
import { cardsService } from '@/api/services/cardsServices'
import type { Comment } from '@/types/api/comments'
import type { CardType } from '@/types/api/cards'
import styles from './TaskCardModal.module.css'

interface Props {
  cardId: number
  currentUserId: number
  onClose: () => void
  onEdit: (card: CardType) => void
  onDelete: (cardId: number) => void
}

export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}.${month}.${day} ${hour}:${minute}`
}

export default function TaskCardModal({
  cardId,
  currentUserId,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  const [card, setCard] = useState<CardType | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [inputComment, setInputComment] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editedContent, setEditedContent] = useState('')

  const fetchCardDetail = async () => {
    try {
      const data = await cardsService.getCardsDetail(cardId)
      setCard(data)
    } catch (err) {
      console.error('카드 상세 조회 실패:', err)
    }
  }

  const fetchComments = async (cardId: number) => {
    try {
      const data = await commentsService.getComments(cardId, 10)
      setComments(data.comments)
    } catch (err) {
      console.error('댓글 불러오기 실패:', err)
    }
  }

  const handleAddComment = async () => {
    if (!card || !inputComment.trim()) return

    const dashboardId = card.dashboardId
    if (!card.id || !card.columnId || !dashboardId) {
      alert('댓글 작성에 실패했습니다: 카드 정보가 유효하지 않습니다.')
      return
    }

    try {
      const response = await commentsService.postComments({
        cardId: card.id,
        columnId: card.columnId,
        dashboardId,
        content: inputComment.trim(),
      })
      setComments((prev) => [response, ...prev])
      setInputComment('')
    } catch (error) {
      console.error('❌ 댓글 생성 실패:', error)
      alert('댓글 작성 중 오류가 발생했습니다.')
    }
  }

  const handleEditComment = async (id: number) => {
    try {
      await commentsService.putComments(id, { content: editedContent })
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === id ? { ...comment, content: editedContent } : comment
        )
      )
      setEditingCommentId(null)
      setEditedContent('')
    } catch (error) {
      console.error('댓글 수정 실패:', error)
      alert('댓글 수정 중 오류가 발생했습니다.')
    }
  }

  useEffect(() => {
    fetchCardDetail()
  }, [cardId])

  useEffect(() => {
    if (card) {
      fetchComments(card.id)
    }
  }, [card])

  if (!card) return <div>카드 정보를 불러오는 중입니다...</div>

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modaltop}>
          <h1 className={`text-2xl-bold ${styles.cardTitle}`}>{card.title}</h1>
          <div className={styles.topRightButtons}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={styles.buttonbox}
            >
              <div className={styles.kebabbutton}>
                <Image src="/assets/icon/kebab.svg" alt="메뉴" fill />
              </div>
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <button
                  onClick={() => onEdit(card)}
                  className={styles.editbutton}
                >
                  수정하기
                </button>
                <button
                  onClick={() => {
                    if (confirm('정말 삭제하시겠습니까?')) onDelete(card.id)
                  }}
                >
                  삭제하기
                </button>
              </div>
            )}
            <button onClick={onClose} className={styles.buttonbox}>
              <div className={styles.closebutton}>
                <Image src="/assets/icon/close.svg" alt="닫기" fill />
              </div>
            </button>
          </div>
        </div>

        <section className={styles.assigneebox}>
          <div>
            <span className={styles.assigneespans}>담당자</span>
            <div className="flex items-center gap-[0.8rem] mt-[0.4rem]">
              {card.assignee ? (
                <>
                  <Badge nickname={card.assignee.nickname} />
                  <span>{card.assignee.nickname}</span>
                </>
              ) : (
                <span className="text-gray-400">담당자 없음</span>
              )}
            </div>
          </div>
          <div>
            <span className={styles.assigneespans}>마감일</span>
            <div>{formatDate(card.dueDate)}</div>
          </div>
        </section>

        <div className={styles.sectionInfo}>
          <div className={styles.statusTagRow}>
            <div className={styles.cardStatus}>TODO</div>
            <div className={styles.tagList}>
              {card.tags.map((tag, index) => (
                <Tag key={index} label={tag} />
              ))}
            </div>
          </div>
          <p className={styles.cardDescription}>{card.description}</p>

          {card.imageUrl && (
            <div className={styles.imageWrapper}>
              <Image src={card.imageUrl} alt="카드 이미지" fill />
            </div>
          )}
        </div>

        <div className={styles.commentSection}>
          <label className={styles.commentlabel}>댓글</label>
          <div className={styles.commentInputArea}>
            <textarea
              value={inputComment}
              onChange={(e) => setInputComment(e.target.value)}
              placeholder="댓글을 입력하세요"
              className={`${styles.textareainput} resize-none`}
            />
            <div className={styles.commentinputbutton}>
              <button
                onClick={handleAddComment}
                disabled={!inputComment.trim()}
                className={styles.commentbutton}
              >
                입력
              </button>
            </div>
          </div>

          <div className={styles.commentList}>
            {comments.map((comment) => (
              <div key={comment.id} className={styles.commentCard}>
                <div className={styles.commentMeta}>
                  {formatDate(comment.createdAt)}
                </div>
                {editingCommentId === comment.id ? (
                  <div className={styles.editArea}>
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className={styles.textareainput}
                    />
                    <div className={styles.commentinputbutton}>
                      <button
                        onClick={() => handleEditComment(comment.id)}
                        className={styles.commentbutton}
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className={styles.commentbutton}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.commentContent}>
                      {comment.content}
                    </div>
                    {comment.author.id === currentUserId && (
                      <div className={styles.commentButtons}>
                        <button
                          onClick={() => {
                            setEditingCommentId(comment.id)
                            setEditedContent(comment.content)
                          }}
                        >
                          수정
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
