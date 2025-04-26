import { create } from 'zustand'

type AuthState = {
  accessToken: string | null
  setAccessToken: (token: string) => void
  clearAccessToken: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken:
    typeof window !== 'undefined'
      ? sessionStorage.getItem('accessToken') // 토큰 get
      : null,
  setAccessToken: (token) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('accessToken', token) // 토큰 불러옴
    }
    set({ accessToken: token })
  },
  clearAccessToken: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('accessToken') // 토큰 clear
    }
    set({ accessToken: null })
  },
}))
