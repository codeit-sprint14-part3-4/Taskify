import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type AuthState = {
  accessToken: string | null
  setAccessToken: (token: string) => void
  clearAccessToken: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (token) => {
        set({ accessToken: token })
      },
      clearAccessToken: () => {
        set({ accessToken: null })
      },
    }),
    {
      name: 'auth-storage',
      storage:
        typeof window !== 'undefined' &&
        window.location.hostname === 'localhost'
          ? createJSONStorage(() => localStorage) // 개발환경에서는 로컬스토리지 사용
          : createJSONStorage(() => sessionStorage), // 배포 환경에서는 세션스토리지 사용
    }
  )
)
