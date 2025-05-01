import type {
  Invitation,
  GetInvitationsResponse,
  UpdateInvitationBody,
} from '../../types/api/invitations'
import { handleError } from '../../utils/handleError'
import { useAuthStore } from '@/stores/auth'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

// GET: 내가 받은 초대 목록 조회
const getInvitations = async (
  size = 10,
  cursorId?: number,
  title?: string
): Promise<GetInvitationsResponse> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  const query = `${BASE_URL}/invitations?size=${size}${
    cursorId !== undefined ? `&cursorId=${cursorId}` : ''
  }${title ? `&title=${encodeURIComponent(title)}` : ''}`

  try {
    const res = await fetch(query, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!res.ok) return handleError(res)

    return res.json()
  } catch (error) {
    console.error('초대 목록 조회 실패:', error)
    throw new Error('초대 목록 조회 중 네트워크 오류가 발생했습니다.')
  }
}

// PUT: 초대 응답
const putInvitations = async (
  invitationId: number,
  body: UpdateInvitationBody
): Promise<Invitation> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  try {
    const res = await fetch(`${BASE_URL}/invitations/${invitationId}`, {
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
    console.error('초대 응답 실패:', error)
    throw new Error('초대 응답 처리 중 네트워크 오류가 발생했습니다.')
  }
}

export const invitationsService = {
  getInvitations,
  putInvitations,
}
