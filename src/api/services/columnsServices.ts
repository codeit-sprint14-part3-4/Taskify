import type {
  Column,
  CreateColumnBody,
  UpdateColumnBody,
  GetColumnsResponse,
  UploadColumnImageResponse,
} from '../../types/api/columns'
import { handleError } from '../../utils/handleError'

const BASE_URL = 'https://sp-taskify-api.vercel.app/14-4'

// POST: 컬럼 생성
const postColumns = async (
  body: CreateColumnBody,
  accessToken: string
): Promise<Column> => {
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
const getColumns = async (
  dashboardId: number,
  accessToken: string
): Promise<GetColumnsResponse> => {
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
  body: UpdateColumnBody,
  accessToken: string
): Promise<Column> => {
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
const deleteColumns = async (
  columnId: number,
  accessToken: string
): Promise<void> => {
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
  file: File,
  accessToken: string
): Promise<UploadColumnImageResponse> => {
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
