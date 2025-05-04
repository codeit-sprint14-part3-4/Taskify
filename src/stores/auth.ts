import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type UserData = {
  id: number
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
// 헉 이거 로컬만 있어요. 배포할 때는 세션으로 하는 조건문 없어졌어요.
