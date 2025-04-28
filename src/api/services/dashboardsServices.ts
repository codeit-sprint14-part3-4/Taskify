import type {
  Dashboard,
  CreateDashboardBody,
  UpdateDashboardBody,
  GetDashboardsResponse,
  Invitation,
  CreateInvitationBody,
  GetInvitationsResponse,
} from '../../types/api/dashboards'
import { handleError } from '../../utils/handleError'
import { useAuthStore } from '@/stores/auth'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

// POST: 대시보드 생성
const postDashboards = async (
  body: CreateDashboardBody
): Promise<Dashboard> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  const res = await fetch(`${BASE_URL}/dashboards`, {
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

// GET: 대시보드 목록 조회
const getDashboards = async (
  navigationMethod: 'pagination' | 'infiniteScroll',
  page = 1,
  size = 10,
  cursorId?: number
): Promise<GetDashboardsResponse> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  const query =
    navigationMethod === 'infiniteScroll'
      ? `navigationMethod=${navigationMethod}&size=${size}${
          cursorId !== undefined ? `&cursorId=${cursorId}` : ''
        }`
      : `navigationMethod=${navigationMethod}&size=${size}&page=${page}`

  const res = await fetch(`${BASE_URL}/dashboards?${query}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) return handleError(res)
  return res.json()
}

// GET: 대시보드 상세 조회
const getDashboardsDetail = async (dashboardId: number): Promise<Dashboard> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  const res = await fetch(`${BASE_URL}/dashboards/${dashboardId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) return handleError(res)
  return res.json()
}

// PUT: 대시보드 수정
const putDashboards = async (
  dashboardId: number,
  body: UpdateDashboardBody
): Promise<Dashboard> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  const res = await fetch(`${BASE_URL}/dashboards/${dashboardId}`, {
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

// DELETE: 대시보드 삭제
const deleteDashboards = async (dashboardId: number): Promise<void> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  const res = await fetch(`${BASE_URL}/dashboards/${dashboardId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) return handleError(res)
}

// POST: 대시보드 초대하기
const postDashboardsInvitations = async (
  dashboardId: number,
  body: CreateInvitationBody
): Promise<Invitation> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  const res = await fetch(`${BASE_URL}/dashboards/${dashboardId}/invitations`, {
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

// GET: 대시보드 초대 불러오기
const getDashboardsInvitations = async (
  dashboardId: number,
  page = 1,
  size = 10
): Promise<GetInvitationsResponse> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  const res = await fetch(
    `${BASE_URL}/dashboards/${dashboardId}/invitations?page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!res.ok) return handleError(res)
  return res.json()
}

// DELETE: 대시보드 초대 취소
const deleteDashboardsInvitations = async (
  dashboardId: number,
  invitationId: number
): Promise<void> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  const res = await fetch(
    `${BASE_URL}/dashboards/${dashboardId}/invitations/${invitationId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!res.ok) return handleError(res)
}

export const dashboardsService = {
  postDashboards,
  getDashboards,
  getDashboardsDetail,
  putDashboards,
  deleteDashboards,
  postDashboardsInvitations,
  getDashboardsInvitations,
  deleteDashboardsInvitations,
}
