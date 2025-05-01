import type {
  Comment,
  GetCommentsResponse,
  CreateCommentBody,
  UpdateCommentBody,
} from '../../types/api/comments'
import { handleError } from '../../utils/handleError'
import { useAuthStore } from '@/stores/auth'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

// POST: 댓글 생성
const postComments = async (body: CreateCommentBody): Promise<Comment> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  try {
    const res = await fetch(`${BASE_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) return handleError(res)

    return res.json()
  } catch (error) {
    console.error('댓글 생성 실패:', error)
    throw new Error('댓글 생성 중 네트워크 오류가 발생했습니다.')
  }
}

// GET: 댓글 목록 조회 (무한 스크롤)
const getComments = async (
  cardId: number,
  size = 10,
  cursorId?: number
): Promise<GetCommentsResponse> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  try {
    const res = await fetch(
      `${BASE_URL}/comments?size=${size}${
        cursorId !== undefined ? `&cursorId=${cursorId}` : ''
      }&cardId=${cardId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!res.ok) return handleError(res)

    return res.json()
  } catch (error) {
    console.error('댓글 목록 조회 실패:', error)
    throw new Error('댓글 목록 조회 중 네트워크 오류가 발생했습니다.')
  }
}

// PUT: 댓글 수정
const putComments = async (
  commentId: number,
  body: UpdateCommentBody
): Promise<Comment> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  try {
    const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) return handleError(res)

    return res.json()
  } catch (error) {
    console.error('댓글 수정 실패:', error)
    throw new Error('댓글 수정 중 네트워크 오류가 발생했습니다.')
  }
}

// DELETE: 댓글 삭제
const deleteComments = async (commentId: number): Promise<void> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  try {
    const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!res.ok) return handleError(res)
  } catch (error) {
    console.error('댓글 삭제 실패:', error)
    throw new Error('댓글 삭제 중 네트워크 오류가 발생했습니다.')
  }
}

export const commentsService = {
  postComments,
  getComments,
  putComments,
  deleteComments,
}
