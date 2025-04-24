import styles from './signup.module.css'

import { usersService } from '../../api/services/usersServices'
import { useAuthStore } from '@/stores/auth'
import Input from '@/components/common/input'
import Button from '@/components/common/button/Button'

import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isTermsAccepted, setIsTermsAccepted] = useState(false)

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const { setAccessToken } = useAuthStore() // Zustand에서 토큰 저장 함수 가져오기
  const router = useRouter()

  const handleSignup = async () => {
    if (!isTermsAccepted) {
      alert('이용약관에 동의해주세요.') // 이용약관 동의 여부 체크
      return
    }

    try {
      const body = {
        email: email,
        nickname: name,
        password: password,
      }
      const response = await usersService.postUsers(body) // 회원가입 API 호출

      // 회원가입 성공 시 받은 토큰을 Zustand 상태에 저장
      setAccessToken(response.accessToken)

      // 회원가입 후 대시보드 페이지로 이동
      router.push('/login')
    } catch (error) {
      console.error('회원가입 오류:', error)
    }
  }

  // 비밀번호 보이기/숨기기 토글 함수
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper_size}>
        <Link href="/mydashboard">
          <div className={styles.flex_center_column}>
            <div className={styles.wrapper_image}>
              <Image src="/assets/icon/logo-icon.svg" alt="로고" fill />
            </div>
            <div className={styles.wrapper_logo_name}>
              <Image src="/assets/icon/logo-title.svg" alt="로고" fill />
            </div>
            <div className={`${styles.logo_welcome} text-xl-medium`}>
              첫 방문을 환영합니다!
            </div>
          </div>
        </Link>
        <div className={`${styles.wrapper_middle} text-lg-medium`}>
          <div className={styles.wrapper_width}>
            <div className={styles.login_font}>이메일</div>
            <Input
              padding="1.2rem 1.6rem"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              error={
                email.length > 0 && !isEmail
                  ? '이메일 형식으로 작성해 주세요.'
                  : ''
              }
            />
          </div>
          <div className={styles.wrapper_width}>
            <div className={styles.login_font}>닉네임</div>
            <Input
              padding="1.2rem 1.6rem"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="닉네임을 입력해주세요"
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
              error={
                password.length > 0 && password.length < 9
                  ? '8글자 이상 입력해 주세요.'
                  : ''
              }
            />
          </div>
          <div className={styles.wrapper_width}>
            <div className={styles.login_font}>
              비밀번호 확인
              <div
                className={styles.hide_icon}
                onClick={toggleConfirmPasswordVisibility}
              >
                <Image
                  src={`/assets/icon/${
                    showConfirmPassword ? 'open_hide.svg' : 'hide_icon.svg'
                  }`}
                  alt="비밀번호 보이기/숨기기 아이콘"
                  fill
                />
              </div>
            </div>
            <Input
              padding="1.2rem 1.6rem"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 한 번 입력하세요"
              type={showConfirmPassword ? 'text' : 'password'}
              error={
                confirmPassword && password !== confirmPassword
                  ? '비밀번호를 확인해 주세요.'
                  : ''
              }
            />
          </div>

          <div className={styles.terms_wrapper}>
            <input
              className={styles.custom_select}
              type="checkbox"
              id="terms"
              checked={isTermsAccepted}
              onChange={() => setIsTermsAccepted(!isTermsAccepted)}
            />
            <label htmlFor="terms">이용약관에 동의합니다.</label>
          </div>
        </div>

        <div className={styles.wrapper_bottom}>
          <Link href="/login">
            <Button variant="login" size="large" onClick={handleSignup}>
              가입하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
