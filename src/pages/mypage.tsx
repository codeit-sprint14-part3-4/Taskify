import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import CommonButton from '@/components/common/commonbutton/CommonButton'
import Layout from '@/components/layout/layout'
import Modal from '@/components/domain/modals/basemodal/ConfirmActionModal'

import { useAuthStore } from '@/stores/auth'
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
  const { accessToken } = useAuthStore()

  const [isLoading, setIsLoading] = useState(true)

  // 사용자 정보를 가져오는 useEffect
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const user = await usersService.getUsers()
        setNickname(user.nickname || '')
        setEmail(user.email || '')

        if (user.profileImageUrl) {
          setPreviewImage(user.profileImageUrl)
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 실패', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  // openModal
  const openModal = (message: string) => {
    setModalMessage(message)
    setIsModalOpen(true)
  }
  // closeModal
  const closeModal = () => {
    setIsModalOpen(false)
    setModalMessage('')
  }
  // 닉네임 포커스 이벤트
  const handleNicknameFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }
  // 닉네임 변경 이벤트
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    if (input.length <= 10) {
      setNickname(input)
    }
  }
  // 프로필 이미지 변경 이벤트
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
  // 비밀번호 유효성 검사
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
  // 새 비밀번호 유효성 검사
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewPassword(value)
    validatePasswords(value, confirmNewPassword)
  }
  // 새 비밀번호 확인 유효성 검사
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    setConfirmNewPassword(value)
    validatePasswords(newPassword, value)
  }
  // 비밀번호 유효성 검사 함수
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
  // 프로필 저장 이벤트
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

      // 상태 업데이트
      useAuthStore.getState().setUserData({
        nickname: updatedUser.nickname,
        email: updatedUser.email,
        profileImageUrl: updatedUser.profileImageUrl,
      })

      openModal('😊 프로필이 성공적으로 수정되었습니다!')
    } catch (error) {
      console.error('프로필 저장 에러:', error)
      openModal('프로필 저장 중 오류가 발생했습니다.')
    }
  }
  // 비밀번호 변경 이벤트
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
      if (error instanceof Error) {
        openModal(error.message || '비밀번호 변경 중 오류가 발생했습니다.')
      } else {
        openModal('알 수 없는 오류가 발생했습니다.') // 예상치 못한 오류 대응
      }
    }
  }
  // 비밀번호 유효성 검사
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
  useEffect(() => {
    if (!accessToken) {
      router.replace('/login') // 로그인 안된 경우 로그인 페이지로
    }
  }, [accessToken, router])

  return isLoading ? (
    <div className="flex flex-col bg-[var(--gray-FAFAFA)] min-h-[80vh]">
      <div className="flex flex-nowrap px-0 items-start justify-start w-full">
        <div className="flex flex-col flex-1 px-[3rem] max-w-[80rem]">
          <div className="mt-[1rem] mb-[2rem]">
            <button type="button" className="flex items-center gap-[0.6rem]">
              <div className="w-[1.6rem] h-[1.6rem] bg-[var(--gray-D9D9D9)] rounded-full animate-pulse"></div>
              <div className="w-[6rem] h-[1.6rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-[0.4rem]"></div>
            </button>
          </div>

          <div className="flex flex-col gap-[2.4rem]">
            {/* 스켈레톤 프로필 카드 */}
            <section className="w-[66.9rem] h-[36.6rem] bg-[var(--white-FFFFFF)] rounded-[1.6rem] p-[3.2rem]">
              <div className="w-[8rem] h-[2rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-[0.4rem] mb-[1.6rem]"></div>
              <div className="flex gap-[3.2rem] max-[767px]:flex-col max-[767px]:gap-[5rem]">
                <div>
                  <div className="w-[18.2rem] h-[18.2rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-[1.6rem]"></div>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="w-[8rem] h-[1.6rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-[0.4rem] mb-[0.4rem]"></div>
                  <div className="h-[5rem] mb-[1.6rem] p-[1.5rem] border border-[var(--gray-D9D9D9)] rounded-[0.8rem] bg-transparent text-[var(--gray-9FA6B2)] animate-pulse"></div>

                  <div className="w-[8rem] h-[1.6rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-[0.4rem] mb-[0.4rem]"></div>
                  <div className="h-[5rem] mb-[2.4rem] p-[1.5rem] border border-[var(--gray-D9D9D9)] rounded-[0.8rem] animate-pulse"></div>

                  <div className="w-full py-[1.5rem] rounded-[0.8rem] text-[var(--white-FFFFFF)] text-lg-semibold bg-[var(--gray-D9D9D9)] cursor-not-allowed animate-pulse h-[5rem]"></div>
                </div>
              </div>
            </section>

            {/* 스켈레톤 비밀번호 변경 카드 */}
            <section className="w-[66.9rem] h-[46.6rem] bg-[var(--white-FFFFFF)] rounded-[1.6rem] p-[3.2rem] flex flex-col">
              <div className="w-[8rem] h-[2rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-[0.4rem] mb-[0.8rem]"></div>
              <div className="flex flex-col">
                <div className="flex flex-col mb-[0.6rem]">
                  <div className="w-[8rem] h-[1.6rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-[0.4rem] mb-[0.4rem]"></div>
                  <div className="w-full h-[5rem] p-[1.5rem] border border-[var(--gray-D9D9D9)] rounded-[0.8rem] bg-[var(--gray-EEEEEE)] animate-pulse"></div>
                  <div className="min-h-[1rem]">
                    <div className="w-[80%] h-[1.6rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-[0.4rem] mt-[0.8rem]"></div>
                  </div>
                </div>

                <div className="flex flex-col mb-[0.6rem]">
                  <div className="w-[8rem] h-[1.6rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-[0.4rem] mb-[0.4rem]"></div>
                  <div className="w-full h-[5rem] p-[1.5rem] border border-[var(--gray-D9D9D9)] rounded-[0.8rem] bg-[var(--gray-EEEEEE)] animate-pulse"></div>
                  <div className="min-h-[1rem]">
                    <div className="w-[80%] h-[1.6rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-[0.4rem] mt-[0.8rem]"></div>
                  </div>
                </div>

                <div className="flex flex-col mb-[0.6rem]">
                  <div className="w-[8rem] h-[1.6rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-[0.4rem] mb-[0.4rem]"></div>
                  <div className="w-full h-[5rem] p-[1.5rem] border border-[var(--gray-D9D9D9)] rounded-[0.8rem] bg-[var(--gray-EEEEEE)] animate-pulse"></div>
                  <div className="min-h-[1rem]">
                    <div className="w-[80%] h-[1.6rem] bg-[var(--gray-D9D9D9)] animate-pulse rounded-[0.4rem] mt-[0.8rem]"></div>
                  </div>
                </div>
              </div>

              <div className="w-full py-[1.5rem] rounded-[0.8rem] mt-[0.8rem] text-[var(--white-FFFFFF)] text-lg-semibold bg-[var(--gray-D9D9D9)] animate-pulse h-[5rem]"></div>
            </section>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>
      <div className="flex flex-col bg-[var(--gray-FAFAFA)] min-h-[80vh]">
        <div className="flex flex-nowrap px-0 items-start justify-start w-full">
          <div className="flex flex-col flex-1 px-[3rem] max-w-[80rem]">
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

            <div className="flex flex-col gap-[2.4rem]">
              {/* 프로필 카드 */}
              <section className="w-[66.9rem] h-[36.6rem] bg-[var(--white-FFFFFF)] rounded-[1.6rem] p-[3.2rem]">
                <h2 className="text-2xl-bold mb-[1.6rem]">프로필</h2>
                <div className="flex gap-[3.2rem] max-[767px]:flex-col max-[767px]:gap-[5rem]">
                  <label
                    htmlFor="avatarUpload"
                    aria-label="프로필 이미지 업로드"
                    className="w-[18.2rem] h-[18.2rem] flex items-center justify-center bg-[var(--gray-EEEEEE)] text-[3.2rem] text-[var(--violet-5534DhA)] border border-[var(--gray-D9D9D9)] rounded-[1.6rem] cursor-pointer transition-colors hover:bg-[var(--gray-FAFAFA)] hover:border-[var(--violet-5534DhA)] "
                  >
                    {previewImage ? (
                      <Image
                        src={previewImage}
                        alt="프로필 미리보기"
                        className="object-cover w-full h-full rounded-[1.6rem]"
                        width={292}
                        height={292}
                        quality={100}
                      />
                    ) : (
                      '+'
                    )}

                    {/* 파일 업로드 input */}
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
                      name="email"
                      type="email"
                      value={email}
                      disabled
                      className="h-[5rem] mb-[1.6rem] p-[1.5rem] border border-[var(--gray-D9D9D9)] rounded-[0.8rem] bg-transparent text-[var(--gray-9FA6B2)] focus:border-[var(--violet-5534DhA)] focus:outline-none"
                    />

                    <label
                      htmlFor="nickname"
                      className="text-lg-regular mb-[0.4rem] text-[var(--black-4B4B4B)]"
                    >
                      닉네임
                    </label>
                    <input
                      id="nickname"
                      name="nickname"
                      type="text"
                      value={nickname}
                      onChange={handleNicknameChange}
                      onFocus={handleNicknameFocus}
                      className="h-[5rem] mb-[2.4rem] p-[1.5rem] border border-[var(--gray-D9D9D9)] rounded-[0.8rem] focus:border-[var(--violet-5534DhA)] focus:outline-none"
                    />

                    <CommonButton
                      variant="primary"
                      isActive={isSaveButtonActive}
                      className={`w-full py-[1.5rem] rounded-[0.8rem] text-[var(--white-FFFFFF)] text-lg-semibold $(
                        isSaveButtonActive
                          ? 'bg-[var(--violet-5534DhA)] cursor-pointer'
                          : 'bg-[var(--gray-D9D9D9)] cursor-not-allowed'
                      )`}
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
              <section className="w-[66.9rem] h-[46.6rem] bg-[var(--white-FFFFFF)] rounded-[1.6rem] p-[3.2rem] flex flex-col">
                <h2 className="text-2xl-bold mb-[0.8rem]">비밀번호 변경</h2>
                <div className="flex flex-col">
                  {/* 현재 비밀번호 */}
                  <div className="flex flex-col mb-[0.6rem]">
                    <label
                      htmlFor="currentPassword"
                      className="text-lg-regular text-[var(--black-4B4B4B)]"
                    >
                      현재 비밀번호
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      placeholder="현재 비밀번호 입력 (8자 이상)"
                      value={currentPassword}
                      onChange={handleCurrentPasswordChange}
                      className={`w-full h-[5rem] p-[1.5rem] border rounded-[0.8rem] focus:border-[var(--violet-5534DhA)] focus:outline-none ${
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

                  {/* 새 비밀번호 */}
                  <div className="flex flex-col mb-[0.6rem]">
                    <label
                      htmlFor="newPassword"
                      className="text-lg-regular text-[var(--black-4B4B4B)]"
                    >
                      새 비밀번호
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      placeholder="새 비밀번호 입력 (8자 이상)"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      className={`w-full h-[5rem] p-[1.5rem] border rounded-[0.8rem] focus:border-[var(--violet-5534DhA)] focus:outline-none ${
                        newPasswordError
                          ? 'border-[var(--red-D6173A)]'
                          : 'border-[var(--gray-D9D9D9)]'
                      }`}
                    />
                    <div className="min-h-[1rem]">
                      {newPasswordError && (
                        <p className="text-[var(--red-D6173A)] text-[1.4rem]">
                          {newPasswordError}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 새 비밀번호 확인 */}
                  <div className="flex flex-col mb-[0.6rem]">
                    <label
                      htmlFor="confirmNewPassword"
                      className="text-lg-regular text-[var(--black-4B4B4B)]"
                    >
                      새 비밀번호 확인
                    </label>
                    <input
                      id="confirmNewPassword"
                      type="password"
                      placeholder="새 비밀번호 다시 입력"
                      value={confirmNewPassword}
                      onChange={handleConfirmPasswordChange}
                      className={`w-full h-[5rem] p-[1.5rem] border rounded-[0.8rem] focus:border-[var(--violet-5534DhA)] focus:outline-none ${
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

                {/* 하단 고정 버튼 */}
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
