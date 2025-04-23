import type {
  Card,
  GetCardsResponse,
  CreateCardBody,
  UpdateCardBody,
} from '../../types/api/cards'
import { handleError } from '../../utils/handleError'

const BASE_URL = 'https://sp-taskify-api.vercel.app/14-4'

// POST: 카드 생성
const postCards = async (
  body: CreateCardBody,
  accessToken: string
): Promise<Card> => {
  const res = await fetch(`${BASE_URL}/cards`, {
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

// GET: 카드 목록 조회
const getCards = async (
  accessToken: string,
  size = 10,
  columnId: number,
  cursorId?: number
): Promise<GetCardsResponse> => {
  const res = await fetch(
    `${BASE_URL}/cards?size=${size}${
      cursorId !== undefined ? `&cursorId=${cursorId}` : ''
    }&columnId=${columnId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!res.ok) return handleError(res)

  return res.json()
}

// PUT: 카드 수정
const putCards = async (
  cardId: number,
  body: UpdateCardBody,
  accessToken: string
): Promise<Card> => {
  const res = await fetch(`${BASE_URL}/cards/${cardId}`, {
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

// GET: 카드 상세 조회
const getCardsDetail = async (
  cardId: number,
  accessToken: string
): Promise<Card> => {
  const res = await fetch(`${BASE_URL}/cards/${cardId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) return handleError(res)

  return res.json()
}

// DELETE: 카드 삭제
const deleteCards = async (
  cardId: number,
  accessToken: string
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) return handleError(res)
}

export const cardsService = {
  postCards,
  getCards,
  putCards,
  getCardsDetail,
  deleteCards,
}
