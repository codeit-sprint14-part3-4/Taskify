import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type UserData = {
  nickname: string
  email: string
  profileImage?: string // 프로필 이미지는 선택 사항
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
  profileImageUrl: string | null
  members: Member[]
  dashboardTitle: string | null
  userName: string | null
  setAuth: (token: string, userId: number) => void
  setUserData: (data: UserData) => void
  setProfileImageUrl: (url: string) => void
  setMembers: (members: Member[]) => void
  setDashboardTitle: (title: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      userId: null,
      userData: null,
      profileImageUrl: null, // 프로필 이미지 URL 상태 추가
      userName: null,
      members: [],
      dashboardTitle: null,
      setAuth: (token, userId) => set({ accessToken: token, userId }),
      setUserData: (data) => {
        set({
          userData: data,
          userName: data.nickname,
          profileImageUrl: data.profileImage || null, // 프로필 이미지 URL을 상태에 반영
        })
      },
      // ...

      setProfileImageUrl: (url) => set({ profileImageUrl: url }), // 프로필 이미지 URL 업데이트
      setMembers: (members) => set({ members }),
      setDashboardTitle: (title) => set({ dashboardTitle: title }),
      clearAuth: () =>
        set({
          accessToken: null,
          userId: null,
          userData: null,
          userName: null,
          members: [],
          dashboardTitle: null,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
