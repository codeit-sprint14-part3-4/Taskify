'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from './login.module.css'
import Image from 'next/image'
import Link from 'next/link'

import Input from '@/components/common/input'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import { authService } from '../../api/services/authServices'
import { useAuthStore } from '@/stores/auth'
import Modal from '@/components/modal/Modal'
import { useFormSignup } from '@/hooks/useFormSignup'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError,
    isFormLoginValid,
  } = useFormSignup()

  const { setAccessToken } = useAuthStore()

  // 로그인 요청 함수
  const handleLogin = async () => {
    if (!email || !password || emailError || passwordError) {
      alert('입력된 정보에 오류가 있습니다.')
      return
    }

    try {
      const body = {
        email,
        password,
      }

      const response = await authService.postAuth(body)
      setAccessToken(response.accessToken)
      router.push('/mydashboard')
    } catch (error: any) {
      console.error('로그인 실패:', error)
      setErrorMessage(error?.message || '로그인 중 문제가 발생했습니다.')
      setShowPasswordModal(true)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper_size}>
        <Link href="/" legacyBehavior>
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
            if (isFormLoginValid) {
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
              error={emailError}
            />
          </div>

          <div className={styles.wrapper_width}>
            <div className={styles.login_font}>
              비밀번호
              <div
                className={styles.hide_icon}
                onClick={() => setShowPassword((prev) => !prev)}
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
              error={passwordError}
            />
          </div>

          <div className={styles.wrapper_bottom}>
            <CommonButton
              padding="1.2rem 0"
              className="w-full text-white bg-[var(--gray-9FA6B2)]"
              isActive={!!isFormLoginValid}
            >
              로그인
            </CommonButton>

            {showPasswordModal && (
              <Modal
                size="large"
                message={errorMessage}
                onConfirm={() => {
                  setShowPasswordModal(false)
                  setErrorMessage('')
                }}
                confirmLabel="확인"
              />
            )}

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
