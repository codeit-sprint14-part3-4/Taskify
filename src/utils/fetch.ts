import { useAuthStore } from '@/stores/auth'

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = useAuthStore.getState().accessToken // 토큰 꺼냄

  // options.headers가 Headers 인스턴스인지 확인하고, 일반 객체로 변환
  const rawHeaders =
    options.headers instanceof Headers
      ? Object.fromEntries(options.headers.entries()) // entries는 [키, 값] 형식의 배열로 반환하는 반환자
      : options.headers ?? {} // 헤더 타입이 아니면 빈 객체로

  // rawHeaders가 객체 형태인지 확인하고, 토큰이 있으면 Authorization 헤더 추가
  const headers: Record<string, string> = {
    ...(typeof rawHeaders === 'object' && !Array.isArray(rawHeaders)
      ? rawHeaders
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // 응답 상태 코드 확인
    if (!response.ok) {
      const errorText = await response.text() // 응답이 JSON이 아니라면 텍스트로 확인
      console.error('API 응답 에러:', errorText) // 에러 메시지 출력
      throw new Error(
        `API 요청 실패, 상태 코드: ${response.status} - ${errorText}`
      )
    }

    return response
  } catch (error) {
    console.error('fetchWithAuth 에러:', error)
    throw error
  }
}

export default fetchWithAuth
