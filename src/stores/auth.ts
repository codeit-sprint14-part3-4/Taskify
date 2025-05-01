import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type UserData = {
  nickname: string
  email: string
  profileImageUrl?: string
}

type Member = {
  id: number
  email: string
  nickname: string
}

type AuthState = {
  accessToken: string | null
  userId: number | null
  userData: UserData | null
  members: Member[] // 멤버 목록
  dashboardTitle: string | null // 데이터 제목
  setAuth: (token: string, userId: number) => void
  setUserData: (data: UserData) => void
  setMembers: (members: Member[] | ((prev: Member[]) => Member[])) => void
  setDashboardTitle: (title: string) => void // 데이터 제목 설정
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      userId: null,
      userData: null,
      members: [],
      dashboardTitle: null,
      setAuth: (token, userId) => set({ accessToken: token, userId }),
      setUserData: (data) => set({ userData: data }),
      setMembers: (members) => set({ members }),
      setDashboardTitle: (title) => set({ dashboardTitle: title }),
      clearAuth: () =>
        set({
          accessToken: null,
          userId: null,
          userData: null,
          members: [],
          dashboardTitle: null,
        }),
    }),
    {
      name: 'auth-storage',
      storage:
        typeof window !== 'undefined' &&
        window.location.hostname === 'localhost'
          ? createJSONStorage(() => localStorage) // 개발 환경에서는 localStorage 사용
          : createJSONStorage(() => sessionStorage), // 배포 환경에서는 sessionStorage 사용
    }
  )
)
