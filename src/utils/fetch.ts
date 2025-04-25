import { useAuthStore } from '@/stores/auth'

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = useAuthStore.getState().accessToken // 토큰 꺼냄

  //토큰이 있으면 fetch 요청 시 Authorization 헤더에 추가함
  const rawHeaders =
    options.headers instanceof Headers //options.headers가 Headers 클래스의 인스턴스인지 확인
      ? Object.fromEntries(options.headers.entries()) // entries는 [키, 값] 형식의 배열로 반환하는 반환자 (헤더는 기본적으로 배열 형태)
      : options.headers ?? {} // 헤더 타입이 아니면 빈 객체로

  // 위 코드가 객체형태인지 맞는지 체크 -> token이 있을 경우에만 Authorization 헤더를 추가
  const headers: Record<string, string> = {
    ...(typeof rawHeaders === 'object' && !Array.isArray(rawHeaders)
      ? rawHeaders
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error('요청 실패!')
  }

  return response
}

export default fetchWithAuth
