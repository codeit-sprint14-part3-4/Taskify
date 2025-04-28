import styles from './signup.module.css'

import { usersService } from '../../api/services/usersServices'
import { useAuthStore } from '@/stores/auth'
import Input from '@/components/common/input'
import CommonButton from '@/components/common/commonbutton/CommonButton'

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

  const [emailError, setEmailError] = useState('')
  const [nameError, setNameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const isFormValid =
    email &&
    name &&
    password &&
    confirmPassword &&
    !emailError &&
    !nameError &&
    !passwordError &&
    !confirmPasswordError &&
    isTermsAccepted

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
      console.log(response)
      setAccessToken(response.accessToken)

      router.push('/login')
      alert('가입이 완료되었습니다.')
    } catch (error) {
      if (error.response?.status === 409) {
        alert('이미 사용중인 이메일입니다.')
      } else if (error.response?.status === 400) {
        alert('이메일 형식으로 작성해주세요.')
      } else if (error.response?.status === 401) {
        alert('Unauthorized')
      } else if (error.response?.status === 403) {
        alert('Forbidden')
      } else {
        console.error('회원가입 오류:', error)
      }
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
            if (isFormValid) {
              handleSignup()
            }
          }}
          className={`${styles.wrapper_middle} text-lg-medium`}
        >
          <div className={`${styles.wrapper_middle} text-lg-medium`}>
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
              <div className={styles.login_font}>닉네임</div>
              <Input
                padding="1.2rem 1.6rem"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="닉네임을 입력해주세요"
                onBlur={() => {
                  if (name.length > 10) {
                    setNameError('열 자 이하로 작성해주세요.')
                  } else {
                    setNameError('')
                  }
                }}
                error={nameError}
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
                onBlur={() => {
                  // 8자 미만일 때 에러 처리
                  if (confirmPassword.length < 8) {
                    setConfirmPasswordError('8자 이상 입력해주세요.')
                  } else if (password !== confirmPassword) {
                    // 비밀번호가 일치하지 않으면 에러 처리
                    setConfirmPasswordError('비밀번호가 일치하지 않습니다.')
                  } else {
                    // 비밀번호 확인이 일치하면 에러 메시지 삭제
                    setConfirmPasswordError('')
                  }
                }}
                error={confirmPasswordError}
                className={confirmPasswordError ? styles.errorBorder : ''}
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
            <CommonButton
              variant="primary"
              padding="1.2rem 1.6rem"
              isActive={!!isFormValid}
              onClick={handleSignup}
              // type="submit"
            >
              가입하기
            </CommonButton>
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
