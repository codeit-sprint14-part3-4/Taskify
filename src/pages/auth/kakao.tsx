import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth'
import { BASE_URL } from '@/config'

export default function KakaoCallbackPage() {
  const router = useRouter()
  const { code } = router.query
  const { setAccessToken } = useAuthStore()

  useEffect(() => {
    if (typeof code !== 'string') return

    const fetchToken = async () => {
      const res = await fetch(`${BASE_URL}/auth/kakao/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      const data = await res.json()
      setAccessToken(data.accessToken)
      router.replace('/')
    }

    fetchToken()
  }, [code])

  return <div>카카오 로그인 중입니다...</div>
}
