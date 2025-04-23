// 에러 객체의 타입 정의

export interface APIError {
  status: number
  message: string
  name: string
  details?: unknown
}
