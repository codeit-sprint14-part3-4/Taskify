import { useState } from 'react'
import { useRouter } from 'next/router'

import Image from 'next/image'
import Link from 'next/link'

import Input from '@/components/common/input'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import { authService } from '../api/services/authServices'
import { useAuthStore } from '@/stores/auth'
import Modal from '@/components/domain/modals/Modal'
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
    <div className="flex items-center justify-center pt-[22.3rem] ">
      <div className="w-[52rem] h-[65.3rem] flex items-center justify-center flex-col transition-all duration-300 ease-in-out">
        <Link href="/" legacyBehavior>
          <a>
            <div className="flex items-center justify-center flex-col mb-[3rem]">
              <div className="relative w-[20rem] h-[19rem]">
                <Image src="/assets/icon/logo-icon.svg" alt="로고" fill />
              </div>
              <div className="relative w-[20rem] h-[5.5rem] mt-[3rem]">
                <Image src="/assets/icon/logo-title.svg" alt="로고" fill />
              </div>
              <div className="text-[var(--black-333236)] text-xl-medium">
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
          className="flex items-center justify-center flex-col text-[var(--black-333236)] gap-8 w-full transition-all duration-300 ease-in-out text-lg-medium"
        >
          <div className="w-full">
            <div className="pb-[0.8rem] relative">이메일</div>
            <Input
              padding="1.2rem 1.6rem"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              error={emailError}
            />
          </div>

          <div className="w-full">
            <div className="pb-[0.8rem] relative">
              비밀번호
              <div
                className="w-[2.4rem] h-[2.4rem] absolute cursor-pointer left-[48rem] top-[4.2rem] z-[1] transition-all duration-300 ease-in-out"
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

          <div className="flex items-center justify-center flex-col gap-8 pt-[0.8rem] w-full">
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

            <div className="flex items-center justify-center">
              <span>회원이 아니신가요?</span>
              <span className="ml-2">
                <Link href="/signup">
                  <span className="text-[color:var(--violet-5534DhA)] underline cursor-pointer hover:text-[darkblue] visited:text-[color:var(--red-D6173A)]">
                    회원가입하기
                  </span>
                </Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
