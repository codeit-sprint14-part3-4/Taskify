// fetch 요청 실패 시, 서버 응답을 APIError 형식으로 정리해 throw하는 함수

import type { APIError } from '@/types/common/error'

const errorNames: Record<number, string> = {
  400: 'BadRequest',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'NotFound',
  409: 'Conflict',
  500: 'InternalServerError',
}

export const handleError = async (res: Response): Promise<never> => {
  const errorData = await res.json()

  const error: APIError = {
    status: res.status,
    name: errorNames[res.status] || 'UnknownError',
    message: errorData.message || '요청 처리 중 오류가 발생했습니다.',
    details: errorData.details,
  }

  throw error
}
