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

  const res = await fetch(query, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) return handleError(res)

  return res.json()
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
}

export const invitationsService = {
  getInvitations,
  putInvitations,
}
