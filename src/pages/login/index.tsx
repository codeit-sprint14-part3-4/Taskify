import { useReducer, useMemo } from 'react'
import { useRouter } from 'next/router'
import styles from './login.module.css'
import Image from 'next/image'
import Link from 'next/link'

import { SignupAction } from '@/types/common/actionTypes'
import Input from '@/components/common/input'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import { authService } from '../../api/services/authServices'
import { useAuthStore } from '@/stores/auth'
import Modal from '@/components/modal/Modal'
import { useFormSignup } from '@/hooks/useFormSignup'

// 필요없는 부분까지 쓴 이유는 signup 타입 하나로 login까지 되게 하고 싶었어요... login 타입을 또 만들면 복잡해서요.. 어차피 안에 로직은 같으니깐요..
const initialState = {
  email: '',
  password: '',
  showPassword: false,
  emailError: '',
  passwordError: '',
  name: '',
  confirmPassword: '',
  nameError: '',
  confirmPasswordError: '',
  showPasswordModal: false,
  toastMessage: '',
  showingToast: false,
  errorMessage: '',
  toastType: 'success' as 'create' | 'delete' | 'success' | 'info',
}

const reducer = (state: typeof initialState, action: SignupAction) => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload }
    case 'SET_PASSWORD':
      return { ...state, password: action.payload }
    case 'SET_EMAIL_ERROR':
      return { ...state, emailError: action.payload }
    case 'SET_PASSWORD_ERROR':
      return { ...state, passwordError: action.payload }
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
    case 'TOGGLE_PASSWORD_VISIBILITY':
      return { ...state, showPassword: !state.showPassword }
    default:
      return state
  }
}

export default function Login() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const router = useRouter()
  const { setAccessToken } = useAuthStore()

  // useFormSignup 훅 호출
  useFormSignup(state, dispatch) // 이메일, 비밀번호 유효성 검사

  const isFormValid = useMemo(() => {
    return (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email) &&
      state.password.length >= 8 &&
      !state.emailError &&
      !state.passwordError
    )
  }, [state.email, state.password, state.emailError, state.passwordError])

  // 로그인 요청 함수
  const handleLogin = async () => {
    if (
      !state.email ||
      !state.password ||
      state.emailError ||
      state.passwordError
    ) {
      alert('입력된 정보에 오류가 있습니다.')
      return
    }
    try {
      const body = {
        email: state.email,
        password: state.password,
      }

      const response = await authService.postAuth(body)
      console.log(response)
      setAccessToken(response.accessToken)

      showToast('로그인에 성공했습니다.', 'success')

      router.push('/mydashboard')
    } catch (error: any) {
      console.error('로그인 실패:', error)
      showToast('비밀번호가 일치하지 않습니다.', error)
      dispatch({
        type: 'SET_MODAL',
        payload: {
          show: true,
          message: error.message || '회원가입 중 문제가 발생했습니다.',
        },
      })
    }
  }

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
            if (isFormValid) {
              handleLogin()
            }
          }}
          className={`${styles.wrapper_middle} text-lg-medium`}
        >
          <div className={styles.wrapper_width}>
            <div className={styles.login_font}>이메일</div>
            <Input
              padding="1.2rem 1.6rem"
              value={state.email}
              onChange={(e) =>
                dispatch({ type: 'SET_EMAIL', payload: e.target.value })
              }
              placeholder="이메일을 입력하세요"
              onBlur={() => {
                if (
                  !state.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
                  state.email.length > 0
                ) {
                  dispatch({
                    type: 'SET_EMAIL_ERROR',
                    payload: '이메일 형식으로 작성해 주세요.',
                  })
                } else {
                  dispatch({ type: 'SET_EMAIL_ERROR', payload: '' })
                }
              }}
              error={state.emailError}
            />
          </div>

          <div className={styles.wrapper_width}>
            <div className={styles.login_font}>
              비밀번호
              <div
                className={styles.hide_icon}
                onClick={() => dispatch({ type: 'TOGGLE_PASSWORD_VISIBILITY' })}
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
              onBlur={() => {
                if (state.password.length < 8) {
                  dispatch({
                    type: 'SET_PASSWORD_ERROR',
                    payload: '8자 이상 입력해주세요.',
                  })
                } else {
                  dispatch({ type: 'SET_PASSWORD_ERROR', payload: '' })
                }
              }}
              error={state.passwordError}
            />
          </div>

          <div className={styles.wrapper_bottom}>
            <CommonButton
              padding="1.2rem 0"
              className="w-full text-white bg-[var(--gray-9FA6B2)]"
              isActive={!!isFormValid}
            >
              로그인
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
