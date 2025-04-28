import type { GetMembersResponse } from '../../types/api/menmbers'
import { handleError } from '../../utils/handleError'
import { useAuthStore } from '@/stores/auth'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

// GET: 대시보드 멤버 목록 조회
const getMembers = async (
  page = 1,
  size = 20,
  dashboardId: number
): Promise<GetMembersResponse> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  const res = await fetch(
    `${BASE_URL}/members?dashboardId=${dashboardId}&page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!res.ok) return handleError(res)

  return res.json()
}

// DELETE: 대시보드 멤버 삭제
const deleteMembers = async (memberId: number): Promise<void> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  const res = await fetch(`${BASE_URL}/members/${memberId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) return handleError(res)
}

export const membersService = {
  getMembers,
  deleteMembers,
}
