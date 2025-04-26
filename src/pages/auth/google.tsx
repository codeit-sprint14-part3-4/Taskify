import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth'
import fetchWithAuth from '@/utils/fetch' // 유틸리티 함수 임포트

const BASE_URL = 'https://sp-taskify-api.vercel.app/14-4' // API 서버 주소

export default function GoogleCallbackPage() {
  const router = useRouter()
  const { code } = router.query
  const { setAccessToken } = useAuthStore()

  useEffect(() => {
    if (typeof code !== 'string') return

    const fetchToken = async () => {
      try {
        const res = await fetchWithAuth(`${BASE_URL}/auth/google/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        })

        // 응답 상태와 내용을 로그로 출력
        console.log('응답 상태:', res.status)
        const data = await res.json()
        console.log('응답 데이터:', data)

        if (!data.accessToken) {
          throw new Error('accessToken을 찾을 수 없습니다.')
        }

        setAccessToken(data.accessToken) // 토큰 상태 업데이트
        router.replace('/mydashboard') // 로그인 성공 시 대시보드로 이동
      } catch (error) {
        console.error('에러 발생:', error)
        alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
        router.replace('/login') // 실패 시 로그인 페이지로 리다이렉트
      }
    }

    fetchToken()
  }, [code, router, setAccessToken])

  return <div>구글 로그인 중입니다...</div>
}
