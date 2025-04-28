import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from '@/pages/mypage.module.css'
import Button from '@/components/common/commonbutton/CommonButton'
import Sidebar from '@/components/layout/sidebar/Sidebar'
import HomeNavBar from '@/components/layout/gnb/HomeNavBar'
import Modal from '@/components/domain/modals/Modal'
import { useState } from 'react'

export default function MyPage() {
  const router = useRouter()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const [currentPasswordError, setCurrentPasswordError] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('')

  // Modal 상태
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  const openModal = (message: string) => {
    setModalMessage(message)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setModalMessage('')
    setIsModalOpen(false)
  }

  // 비밀번호 변경 로직
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewPassword(value)

    if (confirmNewPassword && value !== confirmNewPassword) {
      setNewPasswordError('비밀번호가 일치하지 않습니다.')
    } else {
      setNewPasswordError('')
    }
  }
  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      openModal('새 비밀번호는 최소 8자 이상이어야 합니다.')
      return
    }
    if (newPassword !== confirmNewPassword) {
      openModal('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      const rawAuth = localStorage.getItem('persist:auth')
      if (!rawAuth) {
        openModal('로그인이 필요합니다.')
        return
      }

      const parsedAuth = JSON.parse(rawAuth)
      const { accessToken } = parsedAuth.state

      if (!accessToken) {
        openModal('액세스 토큰이 없습니다.')
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            password: currentPassword,
            newPassword: newPassword,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        openModal(errorData.message || '비밀번호 변경에 실패했습니다.')
        return
      }

      openModal('비밀번호가 성공적으로 변경되었습니다!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      setNewPasswordError('')
    } catch (error) {
      openModal('비밀번호 변경 중 오류가 발생했습니다.')
    }
  }
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    setConfirmNewPassword(value)

    if (newPassword !== value) {
      setNewPasswordError('비밀번호가 일치하지 않습니다.')
    } else {
      setNewPasswordError('')
    }
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

  // 이메일 입력 필드 유지
  const handleSaveProfile = async () => {
    if (!nickname && !profileImage) {
      openModal('닉네임이나 프로필 이미지를 수정해야 합니다.')
      return
    }

    try {
      const rawAuth = localStorage.getItem('persist:auth')
      if (!rawAuth) {
        openModal('로그인이 필요합니다.')
        return
      }

      const parsedAuth = JSON.parse(rawAuth)
      const { accessToken } = parsedAuth.state

      if (!accessToken) {
        openModal('로그인이 필요합니다.')
        return
      }

      let profileImageUrl = ''
      if (profileImage) {
        profileImageUrl = await uploadProfileImage(profileImage)
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/me`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            nickname: nickname || undefined,
            profileImageUrl: profileImageUrl || undefined,
          }),
        }
      )

      if (!response.ok) {
        let errorMsg
        try {
          errorMsg = await response.json()
        } catch (e) {
          errorMsg = await response.text()
        }
        openModal(`서버 오류: ${JSON.stringify(errorMsg)}`)
        return
      }

      const successData = await response.json()
      openModal('😊 프로필이 성공적으로 수정되었습니다!')
    } catch (error) {
      openModal('프로필 저장 중 오류가 발생했습니다.')
    }
  }

  const uploadProfileImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)

    const rawAuth = localStorage.getItem('persist:auth')
    const parsedAuth = JSON.parse(rawAuth || '{}')
    const { accessToken } = parsedAuth.state

    if (!accessToken) {
      throw new Error('액세스 토큰이 없습니다.')
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/me/image`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('이미지 업로드에 실패했습니다.')
    }

    const data = await response.json()
    return data.profileImageUrl
  }

  // 비밀번호 변경 버튼 활성화 여부
  const isPasswordValid =
    newPassword.length >= 8 && newPassword === confirmNewPassword
  const isProfileSaveValid = nickname || profileImage

  return (
    <div className={styles.navbar}>
      <HomeNavBar dashboardId={1} pageType="mydashboard" />
      <div className={styles.layout}>
        <Sidebar />
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
            {/* 프로필 섹션 */}
            <section className={`${styles.card} ${styles.profileCard}`}>
              <h2 className={styles.sectionTitle}>프로필</h2>
              <div className={styles.profileWrapper}>
                <label htmlFor="avatarUpload" className={styles.avatar}>
                  {previewImage ? (
                    <img
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
                    value=""
                    disabled
                  />

                  <label htmlFor="nickname">닉네임</label>
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    placeholder="닉네임 입력 (최대 10자)"
                    value={nickname}
                    onChange={handleNicknameChange}
                  />

                  <Button
                    variant="primary"
                    isActive={nickname.length > 0 || profileImage !== null}
                    className={`${styles.saveButton} ${
                      nickname.length > 0 || profileImage !== null
                        ? styles.activeButton
                        : styles.inactiveButton
                    }`}
                    onClick={handleSaveProfile}
                  >
                    저장
                  </Button>
                </div>
              </div>
            </section>

            {/* 비밀번호 변경 섹션 */}
            <section className={`${styles.card} ${styles.passwordCard}`}>
              <h2 className={styles.sectionTitle}>비밀번호 변경</h2>
              <div className={styles.passwordForm}>
                <label htmlFor="currentPassword">현재 비밀번호</label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  placeholder="현재 비밀번호 입력"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <label htmlFor="newPassword">새 비밀번호</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="새 비밀번호 입력 (8자 이상)"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                />

                <label htmlFor="confirmNewPassword">새 비밀번호 확인</label>
                <input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  placeholder="새 비밀번호 다시 입력"
                  value={confirmNewPassword}
                  onChange={handleConfirmPasswordChange}
                  className={newPasswordError ? styles.inputError : ''}
                />
                {newPasswordError && (
                  <p className={styles.errorMessage}>{newPasswordError}</p>
                )}

                <div style={{ marginTop: '1rem' }}>
                  <Button
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
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          message={modalMessage}
          onConfirm={closeModal}
          size="large"
          confirmLabel="확인"
        />
      )}
    </div>
  )
}
