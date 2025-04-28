import { useState, useEffect, useRef } from 'react'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import Image from 'next/image'
import Tag from '@/components/common/tag/Tag'
import type { TagColor } from '@/types/common/tag'
import CommonInput from '@/components/common/input'
import styles from './TaskCardModal.module.css'

export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}.${month}.${day}` // 연도.월.일
}

interface Comment {
  id: string
  userId: string
  content: string
  createdAt: string
}

interface CardData {
  id: string
  title: string
  description: string
  tags: { label: string; color: TagColor }[]
  dueDate: string
  status: string
  assignee: { id: string; name: string }
  imageUrl?: string
}

interface Props {
  card: CardData
  currentUserId: string
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
  const commentContainerRef = useRef<HTMLDivElement>(null)

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `https://sp-taskify-api.vercel.app/comments?cardId=${card.id}`
      )
      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error('댓글 불러오기 실패', error)
    }
  }

  const loadMoreComments = async () => {
    setIsLoadingMore(true)
    await new Promise((res) => setTimeout(res, 1000))
    await fetchComments()
    setIsLoadingMore(false)
  }

  const handleScroll = () => {
    if (!commentContainerRef.current) return
    const { scrollTop, clientHeight, scrollHeight } =
      commentContainerRef.current
    if (scrollTop + clientHeight >= scrollHeight - 50 && !isLoadingMore) {
      loadMoreComments()
    }
  }

  const addComment = async () => {
    if (!inputComment.trim()) return
    try {
      const response = await fetch(
        'https://sp-taskify-api.vercel.app/comments',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cardId: card.id,
            content: inputComment,
          }),
        }
      )
      const newComment = await response.json()
      setComments((prev) => [newComment, ...prev])
      setInputComment('')
    } catch (error) {
      console.error('댓글 추가 실패', error)
    }
  }

  const editComment = async (id: string, newContent: string) => {
    try {
      await fetch(`https://sp-taskify-api.vercel.app/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      })
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === id ? { ...comment, content: newContent } : comment
        )
      )
    } catch (error) {
      console.error('댓글 수정 실패', error)
    }
  }

  const deleteComment = async (id: string) => {
    try {
      await fetch(`https://sp-taskify-api.vercel.app/comments/${id}`, {
        method: 'DELETE',
      })
      setComments((prev) => prev.filter((comment) => comment.id !== id))
    } catch (error) {
      console.error('댓글 삭제 실패', error)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

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
                    if (confirm('정말 삭제하시겠습니까?')) {
                      onDelete(card.id)
                    }
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

        <div className={`${styles.sectionInfo}`}>
          <div className={styles.statusTagRow}>
            <div className={styles.cardStatus}>{card.status}</div>
            <div className={styles.tagList}>
              <Image
                src="/assets/icon/vector-icon.svg"
                alt="상태와 태그 경계선"
                width={2}
                height={20}
              />
            </div>
            {card.tags.map((tag, idx) => (
              <Tag key={idx} label={tag.label} color={tag.color} />
            ))}
          </div>

          <p className={styles.cardDescription}>{card.description}</p>

          {card.imageUrl && (
            <div className={styles.imageWrapper}>
              <Image src={card.imageUrl} alt="카드 이미지" fill />
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
          <div
            ref={commentContainerRef}
            onScroll={handleScroll}
            className={styles.commentList}
          >
            {comments.map((comment) => (
              <div key={comment.id} className={styles.commentCard}>
                <div className={styles.commentMeta}>
                  {formatDate(comment.createdAt)}
                </div>
                <div className={styles.commentContent}>{comment.content}</div>
                {comment.userId === currentUserId && (
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
            {isLoadingMore && (
              <div className={styles.loadingText}>댓글 불러오는 중...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
