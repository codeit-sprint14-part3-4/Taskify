import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Tag from '@/components/common/tag/Tag'
import { commentsService } from '@/api/services/commentsServices'
import type { Comment } from '@/types/api/comments'
import styles from './taskCardModal.module.css'
import { CardType } from '@/types/api/cards'
import { useAuthStore } from '@/stores/auth'
import AnimatedModalContainer from '@/components/common/animatedmodalcontainer/AnimatedModalContainer'
import Badge from '@/components/common/badge/Badge'
import { ColumnType } from '@/types/api/columns'

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
  columnInfo: ColumnType
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
  const [isCommentsLoaded, setIsCommentsLoaded] = useState(false)
  const [editingComments, setEditingComments] = useState<{
    [key: number]: string | null
  }>({})

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
        columnId: columnInfo.id,
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
    if (!isCommentsLoaded) return

    const container = commentContainerRef.current
    const target = observerTargetRef.current

    if (!container || !target) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isLoadingMore && cursorId) {
          loadMoreComments()
        }
      },

      { root: container, threshold: 0.1 }
    )

    observer.observe(target)

    return () => {
      observer.disconnect() // 안전하게 해제
    }
  }, [isCommentsLoaded, isLoadingMore, cursorId])

  useEffect(() => {
    const fetch = async () => {
      const delay = new Promise((res) => setTimeout(res, 300))
      const commentFetch = getComments()

      await Promise.all([delay, commentFetch])
      setIsCommentsLoaded(true)
    }

    fetch()
  }, [])

  const isLoading = !card || !isCommentsLoaded

  if (!userData) return

  return (
    <AnimatedModalContainer isLoading={isLoading}>
      <div className={styles.overlay}>
        <div className={styles.modalContainer}>
          <div className={styles.modalheder}>
            <h1 className={`${styles.cardTitle}`}>{card.title}</h1>
            <div className={styles.menubuttonbox}>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={styles.buttonbox}
              >
                <div className={styles.kebabbutton}>
                  <Image src="/assets/icon/kebab.svg" alt="메뉴" fill />
                </div>
              </button>
              {isDropdownOpen && (
                <div className={styles.dropdownBox}>
                  <button
                    className={styles.menuItem}
                    onClick={() => onEdit(card)}
                  >
                    수정하기
                  </button>
                  <button
                    className={styles.menuItem}
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
              <div className={styles.assigneelabel}>담당자</div>
              <div className={styles.assigneecontent}>
                {card.assignee ? (
                  card.assignee.profileImageUrl ? (
                    <>
                      <Image
                        src={card.assignee.profileImageUrl}
                        alt="프로필 이미지"
                        width={24}
                        height={24}
                        className="md:w-[3.4rem] md:h-[3.4rem] w-[2.6rem] h-[2.6rem] rounded-full object-cover"
                      />
                      <span className="text-[#333236]">
                        {card.assignee.nickname}
                      </span>
                    </>
                  ) : (
                    <>
                      <Badge nickname={card.assignee.nickname} />
                      <span className={styles.assigneespan}>
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
              <div className={styles.deadlinelabel}>마감일</div>
              <div className={styles.deadlinecontent}>
                {card.dueDate ? formatDate(card.dueDate) : ''}
              </div>
            </div>
          </section>

          <div>
            <div className={styles.statusTagRow}>
              <div className={styles.statusborder}>
                <div className={styles.statuscircle}></div>
                <div>{columnInfo.title}</div>
              </div>
              <div className={styles.verticalDivider}></div>
              <div className={styles.tagList}>
                {card.tags.map((tag, index) => (
                  <Tag key={index} label={tag} />
                ))}
              </div>
            </div>

            <p className={styles.cardDescription}>{card.description}</p>

            {card.imageUrl && (
              <div className={styles.imageWrapper}>
                <Image
                  className="rounded-[0.6rem] object-cover"
                  src={card.imageUrl}
                  alt="카드 이미지"
                  fill
                  priority
                />
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
                  placeholder="댓글을 작성하기"
                  className={`${styles.textareainput} text-md-regular resize-none`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      addComment()
                    }
                  }}
                />
                <div className={styles.commentinputbutton}>
                  <button
                    className={`${styles.commentButton} ${
                      inputComment
                        ? 'text-[#5534DA] cursor-pointer'
                        : 'text-[#D9D9D9]'
                    }`}
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
              className={styles.commentListWrapper}
            >
              {comments.map((comment) => (
                <div key={comment.id} className={styles.commentRow}>
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
                  <div className="xl:w-[45rem] md:w-[42rem] w-full">
                    <div className={styles.commentInfoRow}>
                      <div className={styles.nicknameText}>
                        {comment.author.nickname}
                      </div>
                      <div className={styles.dateText}>
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                    <div className={styles.commentText}>{comment.content}</div>
                    {editingComments[comment.id] !== undefined ? (
                      <>
                        <input
                          type="text"
                          value={editingComments[comment.id] ?? ''}
                          onChange={(e) =>
                            setEditingComments((prev) => ({
                              ...prev,
                              [comment.id]: e.target.value,
                            }))
                          }
                          className={styles.editInput}
                        />
                        <div className={styles.commentActions}>
                          <button
                            className={styles.commentActionBtn}
                            onClick={async () => {
                              await editComment(
                                comment.id,
                                editingComments[comment.id] ?? ''
                              )
                              setEditingComments((prev) => {
                                const updated = { ...prev }
                                delete updated[comment.id]
                                return updated
                              })
                            }}
                            disabled={!editingComments[comment.id]?.trim()}
                          >
                            저장
                          </button>
                          <button
                            className={styles.commentActionBtn}
                            onClick={() =>
                              setEditingComments((prev) => {
                                const updated = { ...prev }
                                delete updated[comment.id]
                                return updated
                              })
                            }
                          >
                            취소
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {comment.author.id === userData.id && (
                          <div className={styles.commentActions}>
                            <button
                              className={styles.commentActionBtn}
                              onClick={() =>
                                setEditingComments((prev) => ({
                                  ...prev,
                                  [comment.id]: comment.content,
                                }))
                              }
                            >
                              수정
                            </button>
                            <button
                              className={styles.commentActionBtn}
                              onClick={() => deleteComment(comment.id)}
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}

              {isLoadingMore && (
                <div className={styles.loadingText}>댓글 불러오는 중...</div>
              )}
              <div ref={observerTargetRef} style={{ height: '0.1rem' }} />
            </div>
          </div>
        </div>
      </div>
    </AnimatedModalContainer>
  )
}
