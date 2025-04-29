import { Dispatch } from 'react'
import { SignupAction } from '@/types/common/actionTypes'
import { useEffect } from 'react'

interface State {
  email: string
  name: string
  password: string
  confirmPassword: string
  emailError: string
  nameError: string
  passwordError: string
  confirmPasswordError: string
}

export const useFormSignup = (
  state: State,
  dispatch: Dispatch<SignupAction>
) => {
  // 이메일 유효성 검사
  useEffect(() => {
    if (
      state.email.length > 0 &&
      !state.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    ) {
      dispatch({
        type: 'SET_EMAIL_ERROR',
        payload: '이메일 형식으로 작성해 주세요.',
      })
    } else {
      dispatch({ type: 'SET_EMAIL_ERROR', payload: '' })
    }
  }, [state.email])

  // 닉네임 유효성 검사
  useEffect(() => {
    if (state.name && !/^[a-zA-Z0-9ㄱ-ㅎ가-힣]*$/.test(state.name)) {
      dispatch({
        type: 'SET_NAME_ERROR',
        payload: '특수문자는 입력할 수 없습니다.',
      })
    } else {
      dispatch({ type: 'SET_NAME_ERROR', payload: '' })
    }

    if (state.name && state.name.length > 10) {
      // state.name이 존재하는지 확인
      dispatch({ type: 'SET_NAME_ERROR', payload: '10자 이하로 작성해주세요.' })
    }
  }, [state.name])

  // 비밀번호 유효성 검사
  useEffect(() => {
    if (state.password && state.password.length < 8) {
      // state.password가 존재하는지 확인
      dispatch({
        type: 'SET_PASSWORD_ERROR',
        payload: '8자 이상 입력해주세요.',
      })
    } else {
      dispatch({ type: 'SET_PASSWORD_ERROR', payload: '' })
    }
  }, [state.password])

  // 비밀번호 확인 유효성 검사
  useEffect(() => {
    if (state.confirmPassword && state.confirmPassword.length < 8) {
      // state.confirmPassword가 존재하는지 확인
      dispatch({
        type: 'SET_CONFIRM_PASSWORD_ERROR',
        payload: '8자 이상 입력해주세요.',
      })
    } else if (state.password !== state.confirmPassword) {
      dispatch({
        type: 'SET_CONFIRM_PASSWORD_ERROR',
        payload: '비밀번호가 일치하지 않습니다.',
      })
    } else {
      dispatch({
        type: 'SET_CONFIRM_PASSWORD_ERROR',
        payload: '',
      })
    }
  }, [state.confirmPassword, state.password])
}
