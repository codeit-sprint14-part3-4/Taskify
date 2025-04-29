import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Tag from '@/components/common/tag/Tag'
import type { TagColor } from '@/types/common/tag'
import { commentsService } from '@/api/services/commentsServices'
import type { Comment } from '@/types/api/comments'
import styles from './TaskCardModal.module.css'

export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}.${month}.${day} ${hour}:${minute}`
}

interface CardData {
  id: string
  title: string
  description: string
  tags: { label: string; color: TagColor }[]
  dueDate: string
  status: string
  assignee: { id: number; name: string }
  imageUrl?: string
}

interface Props {
  card: CardData
  currentUserId: number
  onClose: () => void
  onEdit: (card: CardData) => void
  onDelete: (cardId: string) => void
}

export default function TaskCardModal({
  card,
  currentUserId,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [inputComment, setInputComment] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [cursorId, setCursorId] = useState<number | null>(null)
  const commentContainerRef = useRef<HTMLDivElement>(null)
  const observerTargetRef = useRef<HTMLDivElement>(null)

  const fetchComments = async (isLoadMore = false) => {
    try {
      const data = await commentsService.getComments(
        Number(card.id),
        10,
        isLoadMore ? cursorId ?? undefined : undefined
      )
      setComments((prev) =>
        isLoadMore ? [...prev, ...data.comments] : data.comments
      )
      setCursorId(data.cursorId)
    } catch (error) {
      console.error('댓글 불러오기 실패', error)
    }
  }

  const loadMoreComments = async () => {
    if (!cursorId) return
    setIsLoadingMore(true)
    await fetchComments(true)
    setIsLoadingMore(false)
  }

  const addComment = async () => {
    if (!inputComment.trim()) return
    try {
      const newComment = await commentsService.postComments({
        cardId: Number(card.id),
        content: inputComment,
        columnId: 0,
        dashboardId: 0,
      })
      setComments((prev) => [newComment, ...prev])
      setInputComment('')
    } catch (error) {
      console.error('댓글 추가 실패', error)
    }
  }

  const editComment = async (id: number, newContent: string) => {
    try {
      await commentsService.putComments(id, { content: newContent })
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === id ? { ...comment, content: newContent } : comment
        )
      )
    } catch (error) {
      console.error('댓글 수정 실패', error)
    }
  }

  const deleteComment = async (id: number) => {
    try {
      await commentsService.deleteComments(id)
      setComments((prev) => prev.filter((comment) => comment.id !== id))
    } catch (error) {
      console.error('댓글 삭제 실패', error)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isLoadingMore && cursorId) {
          loadMoreComments()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTargetRef.current) {
      observer.observe(observerTargetRef.current)
    }

    return () => {
      if (observerTargetRef.current) {
        observer.unobserve(observerTargetRef.current)
      }
    }
  }, [isLoadingMore, cursorId])

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
                  className="block w-full text-left p-2"
                  onClick={() => onEdit(card)}
                >
                  수정하기
                </button>
                <button
                  className="block w-full text-left p-2 text-red-500"
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
          <div className={styles.assigneeInfo}>
            <span className={styles.assigneespans}>담당자</span>
            <br />
            {card.assignee.name}
          </div>
          <div className={styles.dueDateInfo}>
            <span className={styles.assigneespans}>마감일</span>
            <br />
            {formatDate(card.dueDate)}
          </div>
        </section>

        <div className={styles.sectionInfo}>
          <div className={styles.statusTagRow}>
            <div className={styles.cardStatus}>{card.status}</div>
            <div className={styles.tagList}>
              {card.tags.map((tag, index) => (
                <Tag key={index} label={tag.label} color={tag.color} />
              ))}
            </div>
          </div>

          <p className={styles.cardDescription}>{card.description}</p>

          {card.imageUrl && (
            <div className={styles.imageWrapper}>
              <Image src={card.imageUrl} alt="카드 이미지" fill priority />
            </div>
          )}
        </div>

        <div className={styles.commentSection}>
          <div>
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
                  onClick={addComment}
                  disabled={!inputComment.trim()}
                  className={styles.commentbutton}
                >
                  입력
                </button>
              </div>
            </div>
          </div>

          <div ref={commentContainerRef} className={styles.commentList}>
            {comments.map((comment) => (
              <div key={comment.id} className={styles.commentCard}>
                <div className={styles.commentMeta}>
                  {formatDate(comment.createdAt)}
                </div>
                <div className={styles.commentContent}>{comment.content}</div>
                {comment.author.id === currentUserId && (
                  <div className={styles.commentButtons}>
                    <button
                      onClick={() => {
                        const newContent = prompt('댓글 수정', comment.content)
                        if (newContent !== null)
                          editComment(comment.id, newContent)
                      }}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="text-red-500"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div ref={observerTargetRef} style={{ height: '0.1rem' }} />

            {isLoadingMore && (
              <div className={styles.loadingText}>댓글 불러오는 중...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
