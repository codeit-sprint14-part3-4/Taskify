import type {
  CreateUserBody,
  UpdateUserBody,
  User,
  UploadUserImageResponse,
} from '../../types/api/users'
import { handleError } from '../../utils/handleError'

const BASE_URL = 'https://sp-taskify-api.vercel.app/14-4'

// POST: 회원가입
const postUsers = async (body: CreateUserBody): Promise<User> => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) return handleError(res)

  return res.json()
}

// GET: 내 정보 조회
const getUsers = async (accessToken: string): Promise<User> => {
  const res = await fetch(`${BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) return handleError(res)

  return res.json()
}

// PUT: 내 정보 수정
const putUsers = async (
  body: UpdateUserBody,
  accessToken: string
): Promise<User> => {
  const res = await fetch(`${BASE_URL}/users/me`, {
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

// POST: 프로필 이미지 업로드
const postUsersMeImage = async (
  file: File,
  accessToken: string
): Promise<UploadUserImageResponse> => {
  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch(`${BASE_URL}/users/me/image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  })

  if (!res.ok) return handleError(res)

  return res.json()
}

export const usersService = {
  postUsers,
  getUsers,
  putUsers,
  postUsersMeImage,
}
