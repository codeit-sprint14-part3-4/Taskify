import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import styles from '@/pages/mypage.module.css'

import CommonButton from '@/components/common/commonbutton/CommonButton'
import Layout from '@/components/layout/layout'
import Modal from '@/components/domain/modals/Modal'

import { usersService } from '@/api/services/usersServices'
import { authService } from '@/api/services/authServices'

export default function MyPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [currentPasswordError, setCurrentPasswordError] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const user = await usersService.getUsers()
        setNickname(user.nickname || '')
        setEmail(user.email || '')
      } catch (error) {
        console.error('사용자 정보 가져오기 실패', error)
      }
    }
    fetchUserInfo()
  }, [])

  const openModal = (message: string) => {
    setModalMessage(message)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalMessage('')
  }

  const handleNicknameFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    if (input.length <= 10) {
      setNickname(input)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCurrentPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    setCurrentPassword(value)

    if (value.length > 0 && value.length < 8) {
      setCurrentPasswordError('현재 비밀번호는 최소 8자 이상이어야 합니다.')
    } else {
      setCurrentPasswordError('')
    }
  }

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewPassword(value)
    validatePasswords(value, confirmNewPassword)
  }

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    setConfirmNewPassword(value)
    validatePasswords(newPassword, value)
  }

  const validatePasswords = (newPass: string, confirmPass: string) => {
    const hasUpperCase = /[A-Z]/.test(newPass)
    const hasLowerCase = /[a-z]/.test(newPass)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPass)

    if (newPass.length > 0 && newPass.length < 8) {
      setNewPasswordError('비밀번호는 최소 8자 이상이어야 합니다.')
    } else if (
      newPass.length > 0 &&
      !(hasUpperCase || hasLowerCase || hasSpecialChar)
    ) {
      setNewPasswordError(
        '비밀번호에는 대문자, 소문자 또는 특수문자 중 하나 이상이 포함되어야 합니다.'
      )
    } else {
      setNewPasswordError('')
    }

    if (confirmPass.length > 0 && confirmPass.length < 8) {
      setConfirmPasswordError('비밀번호는 최소 8자 이상이어야 합니다.')
    } else if (newPass && confirmPass && newPass !== confirmPass) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.')
    } else {
      setConfirmPasswordError('')
    }
  }

  const handleSaveProfile = async () => {
    if (nickname.trim().length < 2 && !profileImage) {
      openModal('닉네임을 2자 이상 입력하거나 프로필 이미지를 수정해야 합니다.')
      return
    }

    try {
      let profileImageUrl: string | undefined

      if (profileImage) {
        const uploadResponse = await usersService.postUsersMeImage(profileImage)
        profileImageUrl = uploadResponse.profileImageUrl
      }

      await usersService.putUsers({
        nickname: nickname || '',
        profileImageUrl,
      })

      openModal('😊 프로필이 성공적으로 수정되었습니다!')
    } catch (error) {
      console.error('프로필 저장 에러:', error)
      openModal('프로필 저장 중 오류가 발생했습니다.')
    }
  }

  const handleChangePassword = async () => {
    const hasUpperCase = /[A-Z]/.test(newPassword)
    const hasLowerCase = /[a-z]/.test(newPassword)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)

    if (currentPassword.length < 8) {
      openModal('현재 비밀번호는 최소 8자 이상이어야 합니다.')
      return
    }
    if (newPassword.length < 8) {
      openModal('새 비밀번호는 최소 8자 이상이어야 합니다.')
      return
    }
    if (!(hasUpperCase || hasLowerCase || hasSpecialChar)) {
      openModal(
        '새 비밀번호에는 대문자, 소문자 또는 특수문자 중 하나 이상이 포함되어야 합니다.'
      )
      return
    }
    if (newPassword !== confirmNewPassword) {
      openModal('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      await authService.putAuth({
        password: currentPassword,
        newPassword,
      })
      openModal('비밀번호가 성공적으로 변경되었습니다!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      setCurrentPasswordError('')
      setNewPasswordError('')
      setConfirmPasswordError('')
    } catch (error) {
      openModal('비밀번호 변경 중 오류가 발생했습니다.')
    }
  }

  const isPasswordValid =
    currentPassword.length >= 8 &&
    newPassword.length >= 8 &&
    confirmNewPassword.length >= 8 &&
    newPassword === confirmNewPassword &&
    (/[A-Z]/.test(newPassword) ||
      /[a-z]/.test(newPassword) ||
      /[!@#$%^&*(),.?":{}|<>]/.test(newPassword))

  const isSaveButtonActive =
    nickname.trim().length >= 2 || profileImage !== null

  return (
    <>
      <Layout pageType="mypage">
        <div className={styles.content}>
          <div className={styles.backWrapper}>
            <button
              className={styles.backButton}
              onClick={() => router.back()}
              type="button"
            >
              <Image
                src="/assets/image/arrow-left.svg"
                alt="뒤로가기"
                width={16}
                height={16}
                className={styles.backIcon}
              />
              <span className={styles.backText}>돌아가기</span>
            </button>
          </div>

          <div className={styles.cardGroup}>
            {/* 프로필 카드 */}
            <section className={`${styles.card} ${styles.profileCard}`}>
              <h2 className={styles.sectionTitle}>프로필</h2>
              <div className={styles.profileWrapper}>
                <label htmlFor="avatarUpload" className={styles.avatar}>
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="프로필 미리보기"
                      className={styles.avatarImage}
                    />
                  ) : (
                    '+'
                  )}
                  <input
                    id="avatarUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>

                <div className={styles.profileForm}>
                  <label htmlFor="email">이메일</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Codeit@naver.com"
                    value={email}
                    disabled
                  />

                  <label htmlFor="nickname">닉네임</label>
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    placeholder="닉네임 입력 (최소 2자 이상, 최대 10자)"
                    value={nickname}
                    onChange={handleNicknameChange}
                    onFocus={handleNicknameFocus}
                  />

                  <CommonButton
                    variant="primary"
                    isActive={isSaveButtonActive}
                    className={`${styles.saveButton} ${
                      isSaveButtonActive
                        ? styles.activeButton
                        : styles.inactiveButton
                    }`}
                    onClick={isSaveButtonActive ? handleSaveProfile : undefined}
                  >
                    저장
                  </CommonButton>
                </div>
              </div>
            </section>
            {/* 비밀번호 변경 카드 */}
            <section className={`${styles.card} ${styles.passwordCard}`}>
              <h2 className={styles.sectionTitle}>비밀번호 변경</h2>
              <div className={styles.passwordForm}>
                <label htmlFor="currentPassword">현재 비밀번호</label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  placeholder="현재 비밀번호 입력 (8자 이상)"
                  value={currentPassword}
                  onChange={handleCurrentPasswordChange}
                  className={currentPasswordError ? styles.inputError : ''}
                />
                {currentPasswordError && (
                  <p className={styles.errorMessage}>{currentPasswordError}</p>
                )}

                <label htmlFor="newPassword">새 비밀번호</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="새 비밀번호 입력 (8자 이상)"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  className={newPasswordError ? styles.inputError : ''}
                />
                {newPasswordError && (
                  <p className={styles.errorMessage}>{newPasswordError}</p>
                )}

                <label htmlFor="confirmNewPassword">새 비밀번호 확인</label>
                <input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  placeholder="새 비밀번호 다시 입력"
                  value={confirmNewPassword}
                  onChange={handleConfirmPasswordChange}
                  className={confirmPasswordError ? styles.inputError : ''}
                />
                {confirmPasswordError && (
                  <p className={styles.errorMessage}>{confirmPasswordError}</p>
                )}

                <div>
                  <CommonButton
                    variant="primary"
                    isActive={isPasswordValid}
                    className={`${styles.changeButton} ${
                      isPasswordValid
                        ? styles.activeButton
                        : styles.inactiveButton
                    }`}
                    onClick={handleChangePassword}
                  >
                    변경
                  </CommonButton>
                </div>
              </div>
            </section>

            {/* 비밀번호 변경 섹션 */}
            <section className={`${styles.card} ${styles.passwordCard}`}>
              <h2 className={styles.sectionTitle}>비밀번호 변경</h2>
              <div className={styles.passwordForm}>
                <label>현재 비밀번호</label>
                <input type="password" placeholder="비밀번호 입력" />
                <label>새 비밀번호</label>
                <input type="password" placeholder="새 비밀번호 입력" />
                <label>새 비밀번호 확인</label>
                <input type="password" placeholder="새 비밀번호 입력" />
                <CommonButton
                  variant="primary"
                  padding="1.2rem 1.2rem"
                  className={styles.changeButton}
                >
                  변경
                </CommonButton>
              </div>
            </section>
          </div>
        </div>
      </Layout>

      <div>
        {isModalOpen && (
          <Modal
            message={modalMessage}
            onConfirm={closeModal}
            size="large"
            confirmLabel="확인"
          />
        )}
      </div>
    </>
  )
}
