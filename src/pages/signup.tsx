import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

import { useFormSignup } from '@/hooks/useFormSignup'
import { usersService } from '../api/services/usersServices'
import Input from '@/components/common/commoninput/CommonInput'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import Modal from '@/components/domain/modals/basemodal/ConfirmActionModal'

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [isLoading, setIsLoading] = useState(false) // 로딩 상태 관리

  const router = useRouter()
  // useFormSignup 훅을 사용하여 회원가입 폼의 상태와 유효성 검사 관리
  const {
    email,
    setEmail,
    nickname,
    setNickname,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    emailError,
    nameError,
    passwordError,
    confirmPasswordError,
    isTermsAccepted,
    setIsTermsAccepted,
    isFormSignupValid,
  } = useFormSignup()

  // 회원가입 요청 함수
  const handleSignup = async () => {
    if (!isTermsAccepted) {
      alert('이용약관에 동의해주세요.')
      return
    }

    // 유효성 검사
    if (
      !email ||
      !nickname ||
      !password ||
      password !== confirmPassword ||
      emailError ||
      nameError ||
      passwordError ||
      confirmPasswordError
    ) {
      return
    }
    setIsLoading(true)
    try {
      const body = { email, nickname, password }
      await usersService.postUsers(body) // 회원가입 API 호출

      setShowPasswordModal(true)
      setErrorMessage('가입이 완료되었습니다.')
    } catch (error) {
      let message = '회원가입 중 문제가 발생했습니다.'
      // error가 Error 객체인지 확인
      if (error instanceof Error) {
        message = error.message || message
      } else if (typeof error === 'string') {
        message = error
      } else if (error && typeof error === 'object' && 'message' in error) {
        message = String((error as { message: string }).message)
      }

      console.error('회원가입 실패:', error)

      setShowPasswordModal(true)
      setErrorMessage(message)
    } finally {
      setIsLoading(false) // 로딩 종료
    }
  }

  return (
    <div className="flex items-center justify-center  pt-[8.8rem] sm:pt-[22.3rem] transition-all duration-300 ease-in-out">
      <div className="w-[90%] max-w-[34rem] sm:max-w-[50rem] h-auto sm:h-[65.3rem] flex items-center justify-center flex-col transition-all duration-300 ease-in-out">
        <Link href="/">
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
              첫 방문을 환영합니다!
            </div>
          </div>
        </Link>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (isFormSignupValid) {
              handleSignup()
            }
          }}
          className="text-lg-medium flex items-center content-center flex-col text-[var(--black-333236)] gap-8 w-full transition-all duration-300 ease-in-out"
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

          {/*닉네임 input*/}
          <div className="w-full">
            <label htmlFor="nickname" className="block mb-[0.8rem]">
              닉네임
            </label>
            <Input
              padding="1.2rem 1.6rem"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력해주세요"
              error={nameError}
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

          {/*비밀번호 확인 input*/}
          <div className="w-full relative">
            <label
              htmlFor="confirmPassword"
              className="inline-block pb-[0.8rem]"
            >
              비밀번호 확인
            </label>
            <Input
              padding="1.2rem 1.6rem"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 한 번 입력하세요"
              type={showConfirmPassword ? 'text' : 'password'}
              error={confirmPasswordError}
            />
            <button
              type="button"
              className="absolute top-[5.5rem] right-[1.6rem] translate-y-[-50%] w-[2.4rem] h-[2.4rem] z-[10] cursor-pointer"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              <Image
                src={`/assets/icon/${
                  showConfirmPassword ? 'open-hide.svg' : 'hide-icon.svg'
                }`}
                alt="비밀번호 보이기/숨기기 아이콘"
                fill
              />
            </button>
          </div>

          <div className="flex items-center justify-start gap-2 w-full">
            <input
              className="w-[2rem] h-[2rem] border border-[0.1rem] border-[var(--gray-D9D9D9)] appearance-none rounded-[0.25rem] cursor-pointer relative checked:bg-[oklch(0.94_0.03_295.46)] checked:border-[var(--gray-D9D9D9)] checked:bg-[url('/assets/icon/check.svg')] checked:bg-no-repeat checked:bg-center checked:bg-[1.2rem_1.2rem]"
              type="checkbox"
              id="terms"
              checked={isTermsAccepted}
              onChange={() => setIsTermsAccepted((prev) => !prev)}
            />
            <label htmlFor="terms">이용약관에 동의합니다.</label>
          </div>

          <div className="flex items-center content-center flex-col gap-8 pt-[0.8rem] w-full text-2xl font-medium">
            <CommonButton
              padding="1.2rem 0"
              className={`w-full text-white ${
                isFormSignupValid
                  ? 'bg-[var(--violet-5534DhA)]'
                  : 'bg-[var(--gray-9FA6B2)]'
              } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
              isActive={!!isFormSignupValid}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>회원가입 중...</span>
                </div>
              ) : (
                '가입하기'
              )}
            </CommonButton>
            {showPasswordModal && (
              <Modal
                size="large"
                message={errorMessage}
                onConfirm={() => {
                  setShowPasswordModal(false)
                  setErrorMessage('')
                  if (errorMessage === '가입이 완료되었습니다.') {
                    router.push('/login')
                  }
                }}
                confirmLabel="확인"
              />
            )}
            <div className="flex items-center justify-center">
              <span>이미 회원이신가요?</span>
              <span className="ml-2">
                <Link href="/login">
                  <span className="text-[color:var(--violet-5534DhA)] underline cursor-pointer hover:text-[darkblue] visited:text-[color:var(--red-D6173A)]">
                    로그인하기
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
