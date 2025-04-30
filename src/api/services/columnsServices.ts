import type {
  ColumnType,
  CreateColumnBody,
  UpdateColumnBody,
  GetColumnsResponse,
  UploadColumnImageResponse,
} from '../../types/api/columns'
import { handleError } from '../../utils/handleError'
import { useAuthStore } from '@/stores/auth'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

// POST: 컬럼 생성
const postColumns = async (body: CreateColumnBody): Promise<ColumnType> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  const res = await fetch(`${BASE_URL}/columns`, {
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

// GET: 컬럼 목록 조회
const getColumns = async (dashboardId: number): Promise<GetColumnsResponse> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  const res = await fetch(`${BASE_URL}/columns?dashboardId=${dashboardId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) return handleError(res)

  return res.json()
}

// PUT: 컬럼 수정
const putColumns = async (
  columnId: number,
  body: UpdateColumnBody
): Promise<ColumnType> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  const res = await fetch(`${BASE_URL}/columns/${columnId}`, {
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

// DELETE: 컬럼 삭제
const deleteColumns = async (columnId: number): Promise<void> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  const res = await fetch(`${BASE_URL}/columns/${columnId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) return handleError(res)
}

// POST: 카드 이미지 업로드
const postColumnsImage = async (
  columnId: number,
  file: File
): Promise<UploadColumnImageResponse> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch(`${BASE_URL}/columns/${columnId}/card-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  })

  if (!res.ok) return handleError(res)

  return res.json()
}

export const columnsService = {
  postColumns,
  getColumns,
  putColumns,
  deleteColumns,
  postColumnsImage,
}
