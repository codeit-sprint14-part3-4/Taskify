import styles from './login.module.css'

import Input from '@/components/common/input'
import Button from '@/components/common/button/Button'
import { authService } from '../../api/services/authServices'
import { useAuthStore } from '@/stores/auth'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

// const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
// const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  //

  // const handleGoogleLogin = () => {
  //   const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/google`

  //   window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=profile email`
  // }

  // const handleKakaoLogin = () => {
  //   window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${BASE_URL}/auth/kakao&response_type=code`
  // }
  //
  const isFormValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length >= 8
  }, [email, password])

  const { setAccessToken } = useAuthStore() // 토큰 관리
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const body = {
        email,
        password,
      }

      const response = await authService.postAuth(body)
      console.log(response)
      // accessToken을 Zustand에 저장
      setAccessToken(response.accessToken)

      // 대시보드로 이동
      router.push('/mydashboard')
    } catch (error) {
      console.error('로그인 실패:', error)
      alert('비밀번호가 일치하지 않습니다.')
    }
  }

  // 비밀번호 보이기/숨기기 토글 함수
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper_size}>
        <Link href="/mydashboard" legacyBehavior>
          <a>
            <div className={styles.flex_center_column}>
              <div className={styles.wrapper_image}>
                <Image src="/assets/icon/logo-icon.svg" alt="로고" fill />
              </div>
              <div className={styles.wrapper_logo_name}>
                <Image src="/assets/icon/logo-title.svg" alt="로고" fill />
              </div>
              <div className={`${styles.logo_welcome} text-xl-medium`}>
                다시 오신 것을 환영합니다!
              </div>
            </div>
          </a>
        </Link>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (isFormValid) {
              handleLogin()
            }
          }}
          className={`${styles.wrapper_middle} text-lg-medium`}
        >
          <div className={styles.wrapper_width}>
            <div className={styles.login_font}>이메일</div>
            <Input
              padding="1.2rem 1.6rem"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              onBlur={() => {
                if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                  setEmailError('이메일 형식으로 작성해 주세요.')
                } else {
                  setEmailError('')
                }
              }}
              error={emailError}
            />
          </div>

          <div className={styles.wrapper_width}>
            <div className={styles.login_font}>
              비밀번호
              <div
                className={styles.hide_icon}
                onClick={togglePasswordVisibility}
              >
                <Image
                  src={`/assets/icon/${
                    showPassword ? 'open_hide.svg' : 'hide_icon.svg'
                  }`}
                  alt="비밀번호 보이기/숨기기 아이콘"
                  fill
                />
              </div>
            </div>
            <Input
              padding="1.2rem 1.6rem"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              type={showPassword ? 'text' : 'password'}
              onBlur={() => {
                if (password.length < 8) {
                  setPasswordError('8자 이상 입력해주세요.')
                } else {
                  setPasswordError('')
                }
              }}
              error={passwordError}
            />
          </div>

          <div className={styles.wrapper_bottom}>
            <Button
              variant="login"
              size="large"
              isActive={!!isFormValid}
              type="submit"
            >
              로그인
            </Button>
            <div className={styles.wrapper_floor}>
              <div>회원이 아니신가요?</div>
              <Link href="/signup">
                <div className={styles.link}>회원가입하기</div>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
