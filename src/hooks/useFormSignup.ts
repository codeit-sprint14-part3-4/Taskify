import { Dispatch } from 'react'
import { SignupAction } from '@/types/common/actionTypes'
import { useEffect } from 'react'

interface State {
  email: string
  nickname: string
  password: string
  confirmPassword: string
  emailError: string
  nameError: string
  passwordError: string
  confirmPasswordError: string
}
// const checkEmailDuplicate = async (
//   email: string,
//   nickname: string,
//   password: string,
//   dispatch: Dispatch<SignupAction>
// ) => {
//   try {
//     const body = {
//       email,
//       nickname,
//       password,
//     }

//     // 가입 시도 (중복 확인 용도지만 어쩔 수 없음)
//     await usersService.postUsers(body)

//     // 성공하면 중복 아님
//     dispatch({ type: 'SET_EMAIL_ERROR', payload: '' })
//   } catch (error: any) {
//     const status = error?.response?.status || error?.status
//     // 409 Conflict: 이미 가입된 이메일
//     if (status === 409) {
//       dispatch({
//         type: 'SET_EMAIL_ERROR',
//         payload: '이미 가입된 이메일입니다.',
//       })
//     } else {
//       dispatch({
//         type: 'SET_EMAIL_ERROR',
//         payload: '이메일 중복 확인 오류가 발생했습니다.',
//       })
//     }
//   }
// }

export const useFormSignup = (
  state: State,
  dispatch: Dispatch<SignupAction>
) => {
  // 이메일 유효성 검사
  useEffect(() => {
    if (
      state.email.length >= 1 &&
      !state.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    ) {
      dispatch({
        type: 'SET_EMAIL_ERROR',
        payload: '이메일 형식으로 작성해 주세요.',
      })
    } else {
      dispatch({ type: 'SET_EMAIL_ERROR', payload: '' })
    }
    if (
      state.email.length > 0 &&
      state.nickname.length > 0 &&
      state.password.length > 0 &&
      state.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    ) {
      // checkEmailDuplicate(state.email, state.nickname, state.password, dispatch)
    }
  }, [state.email])

  // 닉네임 유효성 검사
  useEffect(() => {
    if (state.nickname.length > 0) {
      if (!/^[a-zA-Z0-9ㄱ-ㅎ가-힣]*$/.test(state.nickname)) {
        dispatch({
          type: 'SET_NAME_ERROR',
          payload: '특수문자는 입력할 수 없습니다.',
        })
      } else {
        dispatch({ type: 'SET_NAME_ERROR', payload: '' })
      }

      if (state.nickname.length < 2 || state.nickname.length > 10) {
        dispatch({
          type: 'SET_NAME_ERROR',
          payload: '2자 이상 10자 이하로 작성해주세요.',
        })
      } else {
        dispatch({ type: 'SET_NAME_ERROR', payload: '' })
      }
    } else {
      dispatch({ type: 'SET_NAME_ERROR', payload: '' })
    }
  }, [state.nickname])

  // 비밀번호 유효성 검사
  useEffect(() => {
    if (state.password.length >= 1 && state.password.length < 8) {
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
    if (
      state.confirmPassword.length >= 1 &&
      state.password !== state.confirmPassword
    ) {
      dispatch({
        type: 'SET_CONFIRM_PASSWORD_ERROR',
        payload: '비밀번호가 일치하지 않습니다.',
      })
    } else {
      dispatch({ type: 'SET_CONFIRM_PASSWORD_ERROR', payload: '' })
    }
  }, [state.confirmPassword, state.password])
}
