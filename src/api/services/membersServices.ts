import type { Member, GetMembersResponse } from '../../types/api/menmbers'
import { handleError } from '../../utils/handleError'

const BASE_URL = 'https://sp-taskify-api.vercel.app/14-4'

// GET: 대시보드 멤버 목록 조회
const getMembers = async (
  page = 1,
  size = 20,
  dashboardId: number,
  accessToken: string
): Promise<GetMembersResponse> => {
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
const deleteMembers = async (
  memberId: number,
  accessToken: string
): Promise<void> => {
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
