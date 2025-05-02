import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type UserData = {
  nickname: string
  email: string
  profileImage?: string // 프로필 이미지는 선택 사항 --> profileImageUrl 이거 아닌가요?
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
