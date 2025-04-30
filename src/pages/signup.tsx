import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

import { useFormSignup } from '@/hooks/useFormSignup'
import { usersService } from '../api/services/usersServices'
import Input from '@/components/common/input'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import Modal from '@/components/domain/modals/Modal'

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [showingToast, setShowingToast] = useState(false)

  const router = useRouter()
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

  const handleSignup = async () => {
    if (!isTermsAccepted) {
      alert('이용약관에 동의해주세요.')
      return
    }

    try {
      const body = { email, nickname, password }
      await usersService.postUsers(body)

      showToast('가입이 완료되었습니다.', 'success')
      setShowPasswordModal(true)
      setErrorMessage('가입이 완료되었습니다.')
    } catch (error: any) {
      console.error('회원가입 실패:', error)
      showToast('회원가입 중 문제가 발생했습니다.', 'info')
      setShowPasswordModal(true)
      setErrorMessage(error.message || '회원가입 중 문제가 발생했습니다.')
    }
  }

  const showToast = (
    msg: string,
    type: 'create' | 'delete' | 'success' | 'info'
  ) => {
    setToastMessage(msg)
    setToastType(type)
    setShowingToast(true)

    setTimeout(() => {
      setShowingToast(false)
      setToastMessage('')
      setToastType('success')
    }, 3000)
  }

  return (
    <div className="flex items-center justify-center pt-[22.3rem] transition-all duration-300 ease-in-out">
      <div className="w-[52rem] h-[65.3rem] flex items-center justify-center flex-col transition-all duration-300 ease-in-out">
        <Link href="/">
          <div className="flex items-center justify-center flex-col mb-[3rem]">
            <div className="relative w-[20rem] h-[19rem]">
              <Image src="/assets/icon/logo-icon.svg" alt="로고" fill />
            </div>
            <div className="relative w-[20rem] h-[5.5rem] mt-[3rem]">
              <Image src="/assets/icon/logo-title.svg" alt="로고" fill />
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
            <div className="pb-[0.8rem] relative">닉네임</div>
            <Input
              padding="1.2rem 1.6rem"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력해주세요"
              error={nameError}
            />
          </div>

          <div className="w-full">
            <div className="pb-[0.8rem] relative">
              비밀번호
              <button
                type="button"
                className="w-[2.4rem] h-[2.4rem] absolute cursor-pointer top-[42px] left-[480px] z-[1]"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <Image
                  src={`/assets/icon/${
                    showPassword ? 'open_hide.svg' : 'hide_icon.svg'
                  }`}
                  alt="비밀번호 보이기/숨기기 아이콘"
                  fill
                />
              </button>
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

          <div className="w-full">
            <div className="pb-[0.8rem] relative">
              비밀번호 확인
              <button
                type="button"
                className="w-[2.4rem] h-[2.4rem] absolute cursor-pointer top-[42px] left-[480px] z-[1]"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                <Image
                  src={`/assets/icon/${
                    showConfirmPassword ? 'open_hide.svg' : 'hide_icon.svg'
                  }`}
                  alt="비밀번호 보이기/숨기기 아이콘"
                  fill
                />
              </button>
            </div>
            <Input
              padding="1.2rem 1.6rem"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 한 번 입력하세요"
              type={showConfirmPassword ? 'text' : 'password'}
              error={confirmPasswordError}
            />
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
              className="w-full text-white bg-[var(--gray-9FA6B2)]"
              isActive={!!isFormSignupValid}
            >
              가입하기
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
