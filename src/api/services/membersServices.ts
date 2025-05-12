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

  try {
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
  } catch (error) {
    console.error('멤버 목록 조회 실패:', error)
    throw new Error('멤버 목록 조회 중 네트워크 오류가 발생했습니다.')
  }
}

// DELETE: 대시보드 멤버 삭제
const deleteMembers = async (memberId: number): Promise<void> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  try {
    const res = await fetch(`${BASE_URL}/members/${memberId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!res.ok) return handleError(res)
  } catch (error) {
    console.error('멤버 삭제 실패:', error)
    throw new Error('멤버 삭제 중 네트워크 오류가 발생했습니다.')
  }
}

export const membersService = {
  getMembers,
  deleteMembers,
}
