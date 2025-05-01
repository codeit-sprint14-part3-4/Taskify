import type {
  CreateUserBody,
  UpdateUserBody,
  User,
  UploadUserImageResponse,
} from '../../types/api/users'
import { handleError } from '../../utils/handleError'
import { useAuthStore } from '@/stores/auth'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

// POST: 회원가입
const postUsers = async (body: CreateUserBody): Promise<User> => {
  try {
    const res = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) return handleError(res)

    return res.json()
  } catch (error) {
    console.error('회원가입 실패:', error)
    throw new Error('회원가입 중 네트워크 오류가 발생했습니다.')
  }
}

// GET: 내 정보 조회
const getUsers = async (): Promise<User> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  try {
    const res = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!res.ok) return handleError(res)

    return res.json()
  } catch (error) {
    console.error('내 정보 조회 실패:', error)
    throw new Error('내 정보 조회 중 네트워크 오류가 발생했습니다.')
  }
}

// PUT: 내 정보 수정
const putUsers = async (body: UpdateUserBody): Promise<User> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  try {
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
  } catch (error) {
    console.error('내 정보 수정 실패:', error)
    throw new Error('내 정보 수정 중 네트워크 오류가 발생했습니다.')
  }
}

// POST: 프로필 이미지 업로드
const postUsersMeImage = async (
  file: File
): Promise<UploadUserImageResponse> => {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new Error('사용자 인증 토큰이 없습니다.')
  }

  const formData = new FormData()
  formData.append('image', file)

  try {
    const res = await fetch(`${BASE_URL}/users/me/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    })

    if (!res.ok) return handleError(res)

    return res.json()
  } catch (error) {
    console.error('프로필 이미지 업로드 실패:', error)
    throw new Error('이미지 업로드 중 네트워크 오류가 발생했습니다.')
  }
}

export const usersService = {
  postUsers,
  getUsers,
  putUsers,
  postUsersMeImage,
}
