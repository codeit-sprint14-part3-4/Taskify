import { useState } from 'react'
import { useRouter } from 'next/router'

import Image from 'next/image'
import Link from 'next/link'

import Input from '@/components/common/commoninput/CommonInput'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import { authService } from '../api/services/authServices'
import { useAuthStore } from '@/stores/auth'
import Modal from '@/components/domain/modals/basemodal/Modal'
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

  const { setAuth, setUserData } = useAuthStore()

  // 로그인 요청 함수
  const handleLogin = async () => {
    if (!email || !password || emailError || passwordError) {
      alert('입력된 정보에 오류가 있습니다.')
      return
    }

    try {
      const body = { email, password }
      const response = await authService.postAuth(body)

      const accessToken = response.accessToken
      const userData = response.user

      setAuth(accessToken)
      setUserData(userData)
      router.push('/mydashboard')
    } catch (error) {
      if (error instanceof Error) {
        console.error('로그인 실패:', error)
        setErrorMessage(error?.message || '로그인 중 문제가 발생했습니다.')
        setShowPasswordModal(true)
      }
    }
  }

  return (
    <div className="flex items-center justify-center pt-[22.3rem] ">
      <div className="w-[52rem] h-[65.3rem] flex items-center justify-center flex-col transition-all duration-300 ease-in-out">
        <Link href="/" legacyBehavior>
          <a>
            <div className="flex items-center justify-center flex-col mb-[3rem]">
              <div className="relative w-[20rem] h-[19rem]">
                <Image
                  src="/assets/icon/logo-icon.svg"
                  alt="테스키파이 로고 클릭하면 홈페이지로 갑니다"
                  fill
                />
              </div>
              <div className="relative w-[20rem] h-[5.5rem] mt-[3rem]">
                <Image
                  src="/assets/icon/logo-title.svg"
                  alt="테스키파이 로고 클릭하면 홈페이지로 갑니다"
                  fill
                />
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
          {/*이메일 input*/}
          <div className="w-full">
            <label htmlFor="email" className="block mb-[0.8rem]">
              이메일
            </label>
            <Input
              padding="1.2rem 1.6rem"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              error={emailError}
            />
          </div>

          {/*비밀번호 input*/}
          <div className="w-full relative">
            <label htmlFor="password" className="inline-block pb-[0.8rem]">
              비밀번호
            </label>
            <Input
              padding="1.2rem 1.6rem"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              type={showPassword ? 'text' : 'password'}
              error={passwordError}
            />
            <button
              type="button"
              className="absolute top-[5.5rem] right-[1.6rem] translate-y-[-50%] w-[2.4rem] h-[2.4rem] z-10 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <Image
                src={`/assets/icon/${
                  showPassword ? 'open-hide.svg' : 'hide-icon.svg'
                }`}
                alt="비밀번호 보이기/숨기기 아이콘"
                fill
              />
            </button>
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
