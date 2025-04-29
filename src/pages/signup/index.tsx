import styles from './signup.module.css'

import { useFormSignup } from '@/hooks/useFormSignup'
import { SignupAction } from '@/types/common/actionTypes'
import { usersService } from '../../api/services/usersServices'
import Input from '@/components/common/input'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import Modal from '@/components/modal/Modal'

import { useReducer, useMemo } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

// 상태 초기화
const initialState = {
  email: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  showPassword: false,
  showConfirmPassword: false,
  isTermsAccepted: false,
  emailError: '',
  nameError: '',
  passwordError: '',
  confirmPasswordError: '',
  showPasswordModal: false,
  errorMessage: '',
  toastMessage: '',
  showingToast: false,
  toastType: 'success' as 'create' | 'delete' | 'success' | 'info',
}

// 상태 변화에 따른 액션들 + 타입은 타입 폴더에 정리
const reducer = (state: typeof initialState, action: SignupAction) => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload }
    case 'SET_NAME':
      return { ...state, nickname: action.payload }
    case 'SET_PASSWORD':
      return { ...state, password: action.payload }
    case 'SET_CONFIRM_PASSWORD':
      return { ...state, confirmPassword: action.payload }
    case 'TOGGLE_PASSWORD_VISIBILITY':
      return { ...state, showPassword: !state.showPassword }
    case 'TOGGLE_CONFIRM_PASSWORD_VISIBILITY':
      return { ...state, showConfirmPassword: !state.showConfirmPassword }
    case 'SET_TERMS_ACCEPTED':
      return { ...state, isTermsAccepted: !state.isTermsAccepted }
    case 'SET_EMAIL_ERROR':
      return { ...state, emailError: action.payload }
    case 'SET_NAME_ERROR':
      return { ...state, nameError: action.payload }
    case 'SET_PASSWORD_ERROR':
      return { ...state, passwordError: action.payload }
    case 'SET_CONFIRM_PASSWORD_ERROR':
      return { ...state, confirmPasswordError: action.payload }
    case 'SET_MODAL':
      return {
        ...state,
        showPasswordModal: action.payload.show,
        errorMessage: action.payload.message,
      }
    case 'SET_TOAST':
      return {
        ...state,
        toastMessage: action.payload.message,
        toastType: action.payload.type,
        showingToast: true,
      }
    case 'HIDE_TOAST':
      return {
        ...state,
        showingToast: false,
        toastMessage: '',
        toastType: 'success',
      }
    default:
      return state
  }
}

export default function Signup() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const router = useRouter()
  // 폼 유효성 체크
  useFormSignup(state, dispatch)

  const isFormValid = useMemo(() => {
    return (
      state.email &&
      state.nickname &&
      state.password &&
      state.confirmPassword &&
      !state.emailError &&
      !state.nameError &&
      !state.passwordError &&
      !state.confirmPasswordError &&
      state.isTermsAccepted
    )
  }, [state])

  // 회원가입 요청 함수
  const handleSignup = async () => {
    if (!state.isTermsAccepted) {
      alert('이용약관에 동의해주세요.')
      return
    }

    try {
      const body = {
        email: state.email,
        nickname: state.nickname,
        password: state.password,
      }
      const response = await usersService.postUsers(body)
      console.log(response)
      // 회원가입 성공 시 토스트 메시지 표시
      showToast('가입이 완료되었습니다.', 'success')
      dispatch({
        // 밑 dispatch와 다르게 타입을 나누어 payload 처리
        type: 'SET_MODAL',
        payload: { show: true, message: '가입이 완료되었습니다.' },
      })
    } catch (error: any) {
      console.error('회원가입 실패:', error)
      // 오류 발생 시 토스트 메시지 표시
      showToast('회원가입 중 문제가 발생했습니다.', error)
      dispatch({
        type: 'SET_MODAL',
        payload: {
          show: true,
          message: error.message || '회원가입 중 문제가 발생했습니다.',
        },
      })
    }
  }

  // Toast 메시지 처리 함수
  const showToast = (
    msg: string,
    type: 'create' | 'delete' | 'success' | 'info'
  ) => {
    dispatch({ type: 'SET_TOAST', payload: { message: msg, type: type } })
    setTimeout(() => {
      dispatch({ type: 'HIDE_TOAST' })
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
                value={state.email}
                onChange={(e) =>
                  dispatch({ type: 'SET_EMAIL', payload: e.target.value })
                }
                placeholder="이메일을 입력하세요"
                error={state.emailError}
              />
            </div>
            <div className={styles.wrapper_width}>
              <div className={styles.login_font}>닉네임</div>
              <Input
                padding="1.2rem 1.6rem"
                value={state.nickname}
                onChange={(e) =>
                  dispatch({ type: 'SET_NAME', payload: e.target.value })
                }
                placeholder="닉네임을 입력해주세요"
                error={state.nameError}
              />
            </div>
            <div className={styles.wrapper_width}>
              <div className={styles.login_font}>
                비밀번호
                <div
                  className={styles.hide_icon}
                  onClick={() =>
                    dispatch({ type: 'TOGGLE_PASSWORD_VISIBILITY' })
                  }
                >
                  <Image
                    src={`/assets/icon/${
                      state.showPassword ? 'open_hide.svg' : 'hide_icon.svg'
                    }`}
                    alt="비밀번호 보이기/숨기기 아이콘"
                    fill
                  />
                </div>
              </div>
              <Input
                padding="1.2rem 1.6rem"
                value={state.password}
                onChange={(e) =>
                  dispatch({ type: 'SET_PASSWORD', payload: e.target.value })
                }
                placeholder="비밀번호를 입력하세요"
                type={state.showPassword ? 'text' : 'password'}
                error={state.passwordError}
              />
            </div>
            <div className={styles.wrapper_width}>
              <div className={styles.login_font}>
                비밀번호 확인
                <div
                  className={styles.hide_icon}
                  onClick={() =>
                    dispatch({ type: 'TOGGLE_CONFIRM_PASSWORD_VISIBILITY' })
                  }
                >
                  <Image
                    src={`/assets/icon/${
                      state.showConfirmPassword
                        ? 'open_hide.svg'
                        : 'hide_icon.svg'
                    }`}
                    alt="비밀번호 보이기/숨기기 아이콘"
                    fill
                  />
                </div>
              </div>
              <Input
                padding="1.2rem 1.6rem"
                value={state.confirmPassword}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_CONFIRM_PASSWORD',
                    payload: e.target.value,
                  })
                }
                placeholder="비밀번호를 다시 한 번 입력하세요"
                type={state.showConfirmPassword ? 'text' : 'password'}
                error={state.confirmPasswordError}
              />
            </div>

            <div className={styles.terms_wrapper}>
              <input
                className={styles.custom_select}
                type="checkbox"
                id="terms"
                checked={state.isTermsAccepted}
                onChange={() => dispatch({ type: 'SET_TERMS_ACCEPTED' })}
              />
              <label htmlFor="terms">이용약관에 동의합니다.</label>
            </div>
          </div>

          <div className={styles.wrapper_bottom}>
            <CommonButton
              padding="1.2rem 0"
              className="w-full text-white bg-[var(--gray-9FA6B2)]"
              isActive={!!isFormValid}
            >
              가입하기
            </CommonButton>
            {state.showPasswordModal && (
              <Modal
                size="large"
                message={state.errorMessage}
                onConfirm={() => {
                  dispatch({
                    type: 'SET_MODAL',
                    payload: { show: false, message: '' },
                  })
                  if (state.errorMessage === '가입이 완료되었습니다.') {
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
