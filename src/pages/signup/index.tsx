'use client'
import styles from './signup.module.css'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

import { useFormSignup } from '@/hooks/useFormSignup'
import { usersService } from '../../api/services/usersServices'
import Input from '@/components/common/input'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import Modal from '@/components/modal/Modal'

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
    <div className={styles.wrapper}>
      <div className={styles.wrapper_size}>
        <Link href="/">
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

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (isFormSignupValid) {
              handleSignup()
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
            <div className={styles.login_font}>닉네임</div>
            <Input
              padding="1.2rem 1.6rem"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력해주세요"
              error={nameError}
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

          <div className={styles.wrapper_width}>
            <div className={styles.login_font}>
              비밀번호 확인
              <div
                className={styles.hide_icon}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
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
              error={confirmPasswordError}
            />
          </div>

          <div className={styles.terms_wrapper}>
            <input
              className={styles.custom_select}
              type="checkbox"
              id="terms"
              checked={isTermsAccepted}
              onChange={() => setIsTermsAccepted((prev) => !prev)}
            />
            <label htmlFor="terms">이용약관에 동의합니다.</label>
          </div>

          <div className={styles.wrapper_bottom}>
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
            <div className={styles.wrapper_floor}>
              <div>이미 회원이신가요?</div>
              <Link href="/login">
                <div className={styles.link}>로그인하기</div>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
