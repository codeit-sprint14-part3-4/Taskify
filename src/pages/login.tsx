import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

import Input from '@/components/common/commoninput/CommonInput'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import { authService } from '../api/services/authServices'
import { useAuthStore } from '@/stores/auth'
import Modal from '@/components/domain/modals/basemodal/ConfirmActionModal'
import { useFormSignup } from '@/hooks/useFormSignup'
import { useToast } from '@/context/ToastContext'

export default function Login() {
  const { showToast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false) // 로딩 상태 관리
  const router = useRouter()
  // useFormSignup 훅을 사용하여 로그인 폼의 상태와 유효성 검사 관리
  const {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError,
    isFormLoginValid,
  } = useFormSignup()

  const { setAccessToken, setUserData } = useAuthStore()

  // 로그인 요청 함수
  const handleLogin = async () => {
    if (!email || !password || emailError || passwordError) {
      showToast('입력된 정보에 오류가 있습니다.', 'error')
      return
    }
    setIsLoading(true)
    try {
      const body = {
        email,
        password,
      }

      const response = await authService.postAuth(body)

      // 로그인 성공 후 store에 accessToken과 userData 저장
      const { accessToken, user } = response

      setAccessToken(accessToken) // accessToken 저장
      setUserData(user) // userData 저장

      // 대시보드 페이지로 이동
      router.push('/mydashboard')
    } catch (error) {
      const err = error as Error
      console.error('로그인 실패:', error)
      setErrorMessage(err?.message || '로그인 중 문제가 발생했습니다.')
      setShowPasswordModal(true)
    } finally {
      setIsLoading(false) // 로딩 종료
    }
  }

  return (
    <div className="flex items-center justify-center pt-[8.8rem] pb-[9rem] sm:pt-[22.3rem]">
      <div className="w-[90%] max-w-[34rem] sm:max-w-[50rem] h-auto sm:h-[65.3rem] flex items-center justify-center flex-col transition-all duration-300 ease-in-out">
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
              className={`w-full text-white ${
                isFormLoginValid
                  ? 'bg-[var(--violet-5534DhA)]'
                  : 'bg-[var(--gray-9FA6B2)]'
              } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
              isActive={!!isFormLoginValid}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>로그인 중...</span>
                </div>
              ) : (
                '로그인'
              )}
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
