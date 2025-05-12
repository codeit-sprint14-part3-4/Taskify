import type {
  CardType,
  GetCardsResponse,
  CreateCardBody,
  UpdateCardBody,
} from '../../types/api/cards'
import { handleError } from '../../utils/handleError'
import { useAuthStore } from '@/stores/auth'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

// POST: 카드 생성
const postCards = async (body: CreateCardBody): Promise<CardType> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  try {
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
  } catch (error) {
    console.error('카드 생성 실패:', error)
    throw new Error('카드 생성 중 네트워크 오류가 발생했습니다.')
  }
}

// GET: 카드 목록 조회
const getCards = async (
  size = 10,
  columnId: number,
  cursorId?: number
): Promise<GetCardsResponse> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  try {
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
  } catch (error) {
    console.error('카드 목록 조회 실패:', error)
    throw new Error('카드 목록 조회 중 네트워크 오류가 발생했습니다.')
  }
}

// PUT: 카드 수정
const putCards = async (
  cardId: number,
  body: UpdateCardBody
): Promise<CardType> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  try {
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
  } catch (error) {
    console.error('카드 수정 실패:', error)
    throw new Error('카드 수정 중 네트워크 오류가 발생했습니다.')
  }
}

// GET: 카드 상세 조회
const getCardsDetail = async (cardId: number): Promise<CardType> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  try {
    const res = await fetch(`${BASE_URL}/cards/${cardId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!res.ok) return handleError(res)
    return res.json()
  } catch (error) {
    console.error('카드 상세 조회 실패:', error)
    throw new Error('카드 상세 조회 중 네트워크 오류가 발생했습니다.')
  }
}

// DELETE: 카드 삭제
const deleteCards = async (cardId: number): Promise<void> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  try {
    const res = await fetch(`${BASE_URL}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!res.ok) return handleError(res)
  } catch (error) {
    console.error('카드 삭제 실패:', error)
    throw new Error('카드 삭제 중 네트워크 오류가 발생했습니다.')
  }
}

export const cardsService = {
  postCards,
  getCards,
  putCards,
  getCardsDetail,
  deleteCards,
}
