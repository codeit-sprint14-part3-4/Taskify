import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Tag from '@/components/common/tag/Tag'
import { commentsService } from '@/api/services/commentsServices'
import type { Comment } from '@/types/api/comments'
import styles from './TaskCardModal.module.css'
import { CardType } from '@/types/api/cards'
import { useAuthStore } from '@/stores/auth'
import Badge from '@/components/common/badge/Badge'

export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}.${month}.${day} ${hour}:${minute}`
}

interface Props {
  card: CardType
  dashboardId: number
  columnInfo: { columnId: number; columnTitle: string }
  onClose: () => void
  onEdit: (card: CardType) => void
  onDelete: (cardId: number) => void
}

export default function TaskCardModal({
  card,
  dashboardId,
  columnInfo,
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
  const { userData } = useAuthStore()

  const getComments = async (isLoadMore = false) => {
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
    await getComments(true)
    setIsLoadingMore(false)
  }

  const addComment = async () => {
    if (!inputComment.trim()) return
    try {
      const newComment = await commentsService.postComments({
        cardId: Number(card.id),
        content: inputComment,
        columnId: columnInfo.columnId,
        dashboardId: dashboardId,
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
    getComments()
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

  if (!userData) return

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContainer}>
        <div className="relative flex justify-between items-center mb-[2.4rem]">
          <h1 className={`text-2xl-bold ${styles.cardTitle}`}>{card.title}</h1>
          <div className="flex">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={styles.buttonbox}
            >
              <div className={styles.kebabbutton}>
                <Image src="/assets/icon/kebab.svg" alt="메뉴" fill />
              </div>
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 bg-[#FFFFFF] top-[3rem] right-[4.5rem] p-[0.6rem] border border-[#d9d9d9] shadow-md rounded-[0.6rem] flex flex-col">
                <button
                  className="text-md-regular px-[1.6rem] py-[0.4rem] hover:bg-[#F1EFFD] hover:text-[#5534DA] cursor-pointer"
                  onClick={() => onEdit(card)}
                >
                  수정하기
                </button>
                <button
                  className="text-md-regular px-[1.6rem] py-[0.4rem] hover:bg-[#F1EFFD] hover:text-[#5534DA] cursor-pointer"
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
            <div className="text-[#000000] text-xs-semibold">담당자</div>
            <div className="flex items-center mt-[0.6rem] gap-[0.8rem] text-md-regular">
              {card.assignee ? (
                card.assignee.profileImageUrl ? (
                  <>
                    <Image
                      src={card.assignee.profileImageUrl}
                      alt="프로필 이미지"
                      width={24}
                      height={24}
                      className="w-[3.4rem] h-[3.4rem] rounded-full object-cover"
                    />
                    <span className="text-[#333236]">
                      {card.assignee.nickname}
                    </span>
                  </>
                ) : (
                  <>
                    <Badge nickname={card.assignee.nickname} />
                    <span className="text-[#333236]">
                      {card.assignee.nickname}
                    </span>
                  </>
                )
              ) : (
                '미지정'
              )}
            </div>
          </div>
          <div>
            <div className="text-[#000000] text-xs-semibold">마감일</div>
            <div className="text-[#333236] text-md-regular">
              {formatDate(card.dueDate)}
            </div>
          </div>
        </section>

        <div>
          <div className={styles.statusTagRow}>
            <div className="rounded-full bg-[#F1EFFD] px-[1rem] py-[0.4rem] flex justify-centeri items-center text-[#5534DA] text-xs-regular">
              <div className="w-[0.6rem] h-[0.6rem] bg-[#5534DA] mr-[0.6rem] rounded-full"></div>
              <div>{columnInfo.columnTitle}</div>
            </div>
            <div className="w-[0.1rem] h-[2rem] bg-[#D9D9D9] mx-[2rem]"></div>
            <div className={styles.tagList}>
              {card.tags.map((tag, index) => (
                <Tag key={index} label={tag} />
              ))}
            </div>
          </div>

          <p
            className={`p-[1rem] w-[45rem] mt-[1.6rem] text-md-regular break-all`}
          >
            {card.description}
          </p>

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
                placeholder="댓글 작성하기"
                className={`${styles.textareainput} text-md-regular resize-none`}
              />
              <div className={styles.commentinputbutton}>
                <button
                  className={`w-[8.3rem] h-[3.2rem] border border-[#D9D9D9] rounded-[0.4rem] ${
                    inputComment
                      ? 'text-[#5534DA] cursor-pointer'
                      : 'text-[#D9D9D9]'
                  } text-xs-medium`}
                  onClick={addComment}
                  disabled={!inputComment.trim()}
                >
                  입력
                </button>
              </div>
            </div>
          </div>

          <div
            ref={commentContainerRef}
            className="flex flex-col gap-[2.4rem] mt-[2.4rem]"
          >
            {comments.map((comment) => (
              <div key={comment.id} className="flex w-[45rem] gap-[1rem]">
                <div className="w-[3.4rem] h-[3.4rem]">
                  {comment.author.profileImageUrl ? (
                    <Image
                      className="w-[3.4rem] h-[3.4rem] object-cover"
                      src={comment.author.profileImageUrl}
                      width={50}
                      height={50}
                      alt="프로필 이미지"
                    />
                  ) : (
                    <Badge nickname={comment.author.nickname} />
                  )}
                </div>
                <div className="w-[39rem]">
                  <div className="flex items-center gap-[0.8rem]">
                    <div className="text-[#333236] text-lg-semibold">
                      {comment.author.nickname}
                    </div>
                    <div className="text-[#9FA6B2] text-xs-regular">
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>
                  <div className="text-[#333236] break-all">
                    {comment.content}
                  </div>
                  {comment.author.id === userData.id && (
                    <div className="flex items-center gap-[1.2rem] mt-[1rem] text-[#9FA6B2] text-xs-regular">
                      <button
                        className="border-b border-[#9FA6B2] cursor-pointer"
                        onClick={() => {
                          const newContent = prompt(
                            '댓글 수정',
                            comment.content
                          )
                          if (newContent !== null)
                            editComment(comment.id, newContent)
                        }}
                      >
                        수정
                      </button>
                      <button
                        className="border-b border-[#9FA6B2] cursor-pointer"
                        onClick={() => deleteComment(comment.id)}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
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
