import { useEffect, useState } from 'react'

export const useFormSignup = () => {
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [nameError, setNameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [isTermsAccepted, setIsTermsAccepted] = useState(false)
  const [isFormLoginValid, setIsFormLoginValid] = useState(false)
  const [isFormSignupValid, setIsFormSignupValid] = useState(false)

  useEffect(() => {
    if (email.length >= 1 && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setEmailError('이메일 형식으로 작성해 주세요.')
    } else {
      setEmailError('')
    }
  }, [email])

  useEffect(() => {
    if (nickname.length > 0) {
      if (!/^[a-zA-Z0-9ㄱ-ㅎ가-힣]*$/.test(nickname)) {
        setNameError('특수문자는 입력할 수 없습니다.')
      } else if (nickname.length < 2 || nickname.length > 10) {
        setNameError('2자 이상 10자 이하로 작성해주세요.')
      } else {
        setNameError('')
      }
    } else {
      setNameError('')
    }
  }, [nickname])

  useEffect(() => {
    if (password.length >= 1 && password.length < 8) {
      setPasswordError('8자 이상 입력해주세요.')
    } else {
      setPasswordError('')
    }
  }, [password])

  useEffect(() => {
    if (confirmPassword.length >= 1 && password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.')
    } else {
      setConfirmPasswordError('')
    }
  }, [confirmPassword, password])

  useEffect(() => {
    const valid = email && password && !emailError && !passwordError
    setIsFormLoginValid(Boolean(valid))
  }, [email, password, emailError, passwordError])

  useEffect(() => {
    const valid =
      email &&
      nickname &&
      password &&
      confirmPassword &&
      !emailError &&
      !nameError &&
      !passwordError &&
      !confirmPasswordError &&
      isTermsAccepted

    setIsFormSignupValid(Boolean(valid))
  }, [
    email,
    nickname,
    password,
    confirmPassword,
    emailError,
    nameError,
    passwordError,
    confirmPasswordError,
    isTermsAccepted,
  ])

  return {
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
    isFormLoginValid,
  }
}
