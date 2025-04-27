import { useState, useEffect, useRef } from 'react'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import Image from 'next/image'
import Tag from '@/components/common/tag/Tag'
import type { TagColor } from '@/types/common/tag'
import CommonInput from '@/components/common/input'

function getRelativeTime(dateString: string) {
  const now = new Date()
  const past = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds}초 전`
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}분 전`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}시간 전`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}일 전`
  }
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
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center">
      <div className="w-[58.4rem] max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-8 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button onClick={() => setIsDropdownOpen((prev) => !prev)}>
            <Image
              src="/assets/icon/kebab.svg"
              alt="메뉴"
              width={24}
              height={24}
            />
          </button>
          <button onClick={onClose}>
            <Image
              src="/assets/icon/close.svg"
              alt="닫기"
              width={24}
              height={24}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-10 right-0 bg-white shadow-lg rounded-md border">
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
        </div>

        <div className="mt-12">
          <section>
            <div className="text-gray-600">담당자: {card.assignee.name}</div>
            <div className="text-gray-600">마감일: {card.dueDate}</div>
          </section>
          <h2 className="text-2xl font-bold mt-4">{card.title}</h2>
          <div className="text-sm text-gray-500">상태: {card.status}</div>
          <div className="flex flex-wrap gap-2 my-4">
            {card.tags.map((tag, idx) => (
              <Tag key={idx} label={tag.label} color={tag.color} />
            ))}
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">
            {card.description}
          </p>
          {card.imageUrl && (
            <div className="mt-4">
              <Image
                src={card.imageUrl}
                alt="카드 이미지"
                width={300}
                height={200}
                className="rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="mt-8">
          <div className="flex gap-2">
            <CommonInput
              value={inputComment}
              onChange={(e) => setInputComment(e.target.value)}
              placeholder="댓글을 입력하세요"
              className="flex-1 border rounded-lg p-2 outline-none"
            />
            <CommonButton
              padding="1.4rem"
              variant="primary"
              isActive={!!inputComment.trim()}
              onClick={addComment}
            >
              입력
            </CommonButton>
          </div>
          <div
            ref={commentContainerRef}
            onScroll={handleScroll}
            className="mt-4 max-h-[30rem] overflow-y-auto flex flex-col gap-4"
          >
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 border rounded-lg flex flex-col gap-2"
              >
                <div className="text-sm text-gray-500">
                  {getRelativeTime(comment.createdAt)}
                </div>
                <div className="text-gray-800">{comment.content}</div>
                {comment.userId === currentUserId && (
                  <div className="flex gap-2 text-sm">
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
              <div className="text-center text-gray-500">
                댓글 불러오는 중...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
