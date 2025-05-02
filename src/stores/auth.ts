import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type UserData = {
  nickname: string
  email: string
  profileImageUrl?: string
}

type AuthState = {
  accessToken: string | null
  userData: UserData | null
  setAuth: (token: string) => void
  setUserData: (data: UserData) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      userData: null,
      setAuth: (token) => set({ accessToken: token }),
      setUserData: (data) => {
        set({
          userData: data,
        })
      },
      clearAuth: () =>
        set({
          accessToken: null,
          userData: null,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

//  {
//    previewImage || profileImageUrl ? (
//      <div className="relative w-full h-full">
//        <Image
//          src={previewImage || profileImageUrl || '/path/to/default-image.png'}
//          alt="프로필 미리보기"
//          width={182}
//          height={182}
//          className="object-cover w-full h-full rounded-[1.6rem]"
//        />
//      </div>
//    ) : (
//      <span>
//        +<span className="sr-only">프로필 이미지 업로드</span>
//      </span>
//    )
//  }
