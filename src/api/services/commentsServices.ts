import type {
  Comment,
  GetCommentsResponse,
  CreateCommentBody,
  UpdateCommentBody,
} from '../../types/api/comments'
import { handleError } from '../../utils/handleError'

const BASE_URL = 'https://sp-taskify-api.vercel.app/14-4'

// POST: 댓글 생성
const postComments = async (
  body: CreateCommentBody,
  accessToken: string
): Promise<Comment> => {
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
}

// GET: 댓글 목록 조회 (무한 스크롤)
const getComments = async (
  cardId: number,
  accessToken: string,
  size = 10,
  cursorId?: number
): Promise<GetCommentsResponse> => {
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
}

// PUT: 댓글 수정
const putComments = async (
  commentId: number,
  body: UpdateCommentBody,
  accessToken: string
): Promise<Comment> => {
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
}

// DELETE: 댓글 삭제
const deleteComments = async (
  commentId: number,
  accessToken: string
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) return handleError(res)
}

export const commentsService = {
  postComments,
  getComments,
  putComments,
  deleteComments,
}
