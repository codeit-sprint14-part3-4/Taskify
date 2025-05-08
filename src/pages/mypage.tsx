import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import CommonButton from '@/components/common/commonbutton/CommonButton'
import Modal from '@/components/domain/modals/basemodal/ConfirmActionModal'
import SkeletonMyPage from '@/components/skeleton/SkeletonMyPage'

import { useAuthStore } from '@/stores/auth'
import { usersService } from '@/api/services/usersServices'
import { authService } from '@/api/services/authServices'
import Layout from '@/components/layout/layout'

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
  const { accessToken } = useAuthStore()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const user = await usersService.getUsers()
        setNickname(user.nickname || '')
        setEmail(user.email || '')
        if (user.profileImageUrl) setPreviewImage(user.profileImageUrl)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login')
    }
  }, [accessToken, router])

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
    if (input.length <= 10) setNickname(input)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleCurrentPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    setCurrentPassword(value)
    setCurrentPasswordError(
      value.length > 0 && value.length < 8
        ? '현재 비밀번호는 최소 8자 이상이어야 합니다.'
        : ''
    )
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

    setNewPasswordError(
      newPass.length > 0 && newPass.length < 8
        ? '비밀번호는 최소 8자 이상이어야 합니다.'
        : newPass.length > 0 &&
          !(hasUpperCase || hasLowerCase || hasSpecialChar)
        ? '비밀번호에는 대문자, 소문자 또는 특수문자 중 하나 이상이 포함되어야 합니다.'
        : ''
    )

    setConfirmPasswordError(
      confirmPass.length > 0 && confirmPass.length < 8
        ? '비밀번호는 최소 8자 이상이어야 합니다.'
        : newPass && confirmPass && newPass !== confirmPass
        ? '비밀번호가 일치하지 않습니다.'
        : ''
    )
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

      const updatedUser = await usersService.putUsers({
        nickname: nickname || '',
        profileImageUrl,
      })

      useAuthStore.getState().setUserData({
        id: updatedUser.id,
        nickname: updatedUser.nickname,
        email: updatedUser.email,
        profileImageUrl: updatedUser.profileImageUrl,
      })
      // openModal('😊 프로필이 성공적으로 수정되었습니다!') toast 사용하면 좋을 것 같음음
      openModal('😊 프로필이 성공적으로 수정되었습니다!')
    } catch (error) {
      const err = error as Error
      openModal(err.message || '프로필 저장 중 오류가 발생했습니다.')
    }
  }

  const handleChangePassword = async () => {
    const hasUpperCase = /[A-Z]/.test(newPassword)
    const hasLowerCase = /[a-z]/.test(newPassword)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)

    if (currentPassword.length < 8)
      return openModal('현재 비밀번호는 최소 8자 이상이어야 합니다.')
    if (newPassword.length < 8)
      return openModal('새 비밀번호는 최소 8자 이상이어야 합니다.')
    if (!(hasUpperCase || hasLowerCase || hasSpecialChar)) {
      return openModal(
        '새 비밀번호에는 대문자, 소문자 또는 특수문자 중 하나 이상이 포함되어야 합니다.'
      )
    }
    if (newPassword !== confirmNewPassword)
      return openModal('비밀번호가 일치하지 않습니다.')

    try {
      await authService.putAuth({ password: currentPassword, newPassword })
      openModal('비밀번호가 성공적으로 변경되었습니다!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      setCurrentPasswordError('')
      setNewPasswordError('')
      setConfirmPasswordError('')
    } catch (error) {
      if (error instanceof Error) {
        openModal(error.message || '비밀번호 변경 중 오류가 발생했습니다.')
      } else {
        openModal('알 수 없는 오류가 발생했습니다.')
      }
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

  return isLoading ? (
    <SkeletonMyPage />
  ) : (
    <>
      <div className="flex flex-col bg-[var(--gray-FAFAFA)] min-h-[80vh] max-[767px]:pr-[2rem] max-[767px]:bg-[#ffffff]">
        <div className="flex flex-nowrap px-0 items-start justify-start w-full">
          <div className="flex flex-col flex-1 px-[3rem] max-w-[80rem] min-h-[calc(100vh-7rem)] max-[767px]:pb-[3rem]">
            <div className="mt-[1rem] mb-[2rem]">
              <button
                onClick={() => router.back()}
                type="button"
                className="flex items-center gap-[0.6rem] text-[var(--black-333236)] font-[var(--font-family)] cursor-pointer"
              >
                <Image
                  src="/assets/image/arrow-left.svg"
                  alt="뒤로가기"
                  width={16}
                  height={16}
                  className="w-[1.6rem] h-[1.6rem]"
                />
                <span className="text-[1.6rem] font-medium leading-[2.6rem]">
                  돌아가기
                </span>
              </button>
            </div>

            <div className="flex flex-col gap-[2.4rem] max-[767px]:gap-[1rem] max-[767px]:flex-center max-[767px]:flex items-start flex items-center justify-center">
              {/* 프로필 카드 */}
              <section
                className="
                bg-[var(--white-FFFFFF)] 
                rounded-[1.6rem] 
                p-[3.2rem]
                w-[66.9rem] 
                h-[36.6rem] 
                max-[1023px]:w-[54.8rem] 
                max-[1023px]:h-[36.6rem] 
                max-[767px]:w-full 
                max-[767px]:h-[49.6rem]
                 max-[767px]:p-[0rem]
              "
              >
                <h2 className="text-2xl-bold mb-[1.6rem]">프로필</h2>
                <div className="flex gap-[3.2rem] max-[767px]:flex-col max-[767px]:gap-[5rem]">
                  <label
                    htmlFor="avatarUpload"
                    aria-label="프로필 이미지 업로드"
                    className="w-[18.2rem] h-[18.2rem] max-[767px]:w-[10rem] max-[767px]:h-[10rem] flex items-center justify-center bg-[var(--gray-EEEEEE)] text-[3.2rem] text-[var(--violet-5534DhA)] border border-[var(--gray-D9D9D9)] rounded-[1.6rem] cursor-pointer transition-colors hover:bg-[var(--gray-FAFAFA)] hover:border-[var(--violet-5534DhA)]"
                  >
                    {previewImage ? (
                      <Image
                        src={previewImage}
                        alt="프로필 미리보기"
                        className="object-fit w-full h-full rounded-[1.6rem] "
                        width={292}
                        height={292}
                        quality={100}
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

                  <div className="flex-1 flex flex-col">
                    <label
                      htmlFor="email"
                      className="text-lg-regular mb-[0.4rem] text-[var(--black-4B4B4B)]"
                    >
                      이메일
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="h-[5rem] mb-[1.6rem] p-[1.5rem] max-[767px]:h-[4rem] border border-[var(--gray-D9D9D9)] rounded-[0.8rem] bg-transparent text-[var(--gray-9FA6B2)] focus:border-[var(--violet-5534DhA)] focus:outline-none"
                    />

                    <label
                      htmlFor="nickname"
                      className="text-lg-regular mb-[0.4rem] text-[var(--black-4B4B4B)]"
                    >
                      닉네임
                    </label>
                    <input
                      id="nickname"
                      type="text"
                      value={nickname}
                      onChange={handleNicknameChange}
                      onFocus={handleNicknameFocus}
                      className="h-[5rem] mb-[2.4rem] p-[1.5rem] max-[767px]:h-[4rem] border border-[var(--gray-D9D9D9)] rounded-[0.8rem] focus:border-[var(--violet-5534DhA)] focus:outline-none"
                    />

                    <CommonButton
                      variant="primary"
                      isActive={isSaveButtonActive}
                      className={`w-full py-[1.5rem] rounded-[0.8rem] text-[var(--white-FFFFFF)] text-lg-semibold ${
                        isSaveButtonActive
                          ? 'bg-[var(--violet-5534DhA)] cursor-pointer'
                          : 'bg-[var(--gray-D9D9D9)] cursor-not-allowed'
                      }`}
                      onClick={
                        isSaveButtonActive ? handleSaveProfile : undefined
                      }
                    >
                      저장
                    </CommonButton>
                  </div>
                </div>
              </section>

              {/* 비밀번호 변경 카드 */}
              <section
                className="
                  bg-[var(--white-FFFFFF)] 
                  rounded-[1.6rem] 
                  p-[3.2rem] 
                  flex flex-col 
                  w-[66.9rem] 
                  h-[46.6rem] 
                  max-[1023px]:w-[54.8rem] 
                  max-[1023px]:h-[46.6rem] 
                  max-[767px]:w-full 
                  max-[767px]:h-[42rem]
                  max-[767px]:p-[0rem]
                "
              >
                <h2 className="text-2xl-bold mb-[0.8rem] ">비밀번호 변경</h2>
                <div className="flex flex-col">
                  <div className="flex flex-col mb-[0.6rem]">
                    <label
                      htmlFor="currentPassword"
                      className="text-lg-regular text-[var(--black-4B4B4B)] pb-[0.8rem]"
                    >
                      현재 비밀번호
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      placeholder="현재 비밀번호 입력"
                      value={currentPassword}
                      onChange={handleCurrentPasswordChange}
                      className={`w-full h-[5rem] p-[1.5rem] max-[767px]:h-[4rem] border rounded-[0.8rem] focus:border-[var(--violet-5534DhA)] focus:outline-none ${
                        currentPasswordError
                          ? 'border-[var(--red-D6173A)]'
                          : 'border-[var(--gray-D9D9D9)]'
                      }`}
                    />
                    <div className="min-h-[1rem]">
                      {currentPasswordError && (
                        <p className="text-[var(--red-D6173A)] text-[1.4rem]">
                          {currentPasswordError}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col mb-[0.6rem]">
                    <label
                      htmlFor="newPassword"
                      className="text-lg-regular text-[var(--black-4B4B4B)] pb-[0.8rem]"
                    >
                      새 비밀번호
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      placeholder="새 비밀번호 입력"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      className={`w-full h-[5rem] p-[1.5rem] max-[767px]:h-[4rem] border rounded-[0.8rem] focus:border-[var(--violet-5534DhA)] focus:outline-none ${
                        newPasswordError
                          ? 'border-[var(--red-D6173A)]'
                          : 'border-[var(--gray-D9D9D9)]'
                      }`}
                    />
                    <div className="min-h-[1rem]">
                      {newPasswordError && (
                        <p className="text-[var(--red-D6173A)] text-[1.4rem] ">
                          {newPasswordError}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col mb-[0.6rem]">
                    <label
                      htmlFor="confirmNewPassword"
                      className="text-lg-regular text-[var(--black-4B4B4B)] pb-[0.8rem]"
                    >
                      새 비밀번호 확인
                    </label>
                    <input
                      id="confirmNewPassword"
                      type="password"
                      placeholder="새 비밀번호 다시 입력"
                      value={confirmNewPassword}
                      onChange={handleConfirmPasswordChange}
                      className={`w-full h-[5rem] p-[1.5rem] max-[767px]:h-[4rem] border rounded-[0.8rem] focus:border-[var(--violet-5534DhA)] focus:outline-none ${
                        confirmPasswordError
                          ? 'border-[var(--red-D6173A)]'
                          : 'border-[var(--gray-D9D9D9)]'
                      }`}
                    />
                    <div className="min-h-[1rem]">
                      {confirmPasswordError && (
                        <p className="text-[var(--red-D6173A)] text-[1.4rem]">
                          {confirmPasswordError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <CommonButton
                  variant="primary"
                  isActive={isPasswordValid}
                  className={`w-full py-[1.5rem] rounded-[0.8rem] mt-[0.8rem] text-[var(--white-FFFFFF)] text-lg-semibold ${
                    isPasswordValid
                      ? 'bg-[var(--violet-5534DhA)] cursor-pointer'
                      : 'bg-[var(--gray-D9D9D9)] cursor-not-allowed'
                  }`}
                  onClick={handleChangePassword}
                >
                  변경
                </CommonButton>
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
    </>
  )
}

MyPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout pageType="mypage">{page}</Layout>
}
