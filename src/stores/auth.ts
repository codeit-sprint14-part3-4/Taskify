// 토큰 코드
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware' // persist를 사용하면 상태를 로컬 스토리지나 세션 스토리지에 자동으로 저장하고, 페이지를 새로 고침해도 상태가 유지됨 ( 하지만 URL을 자동으로 처리하지는 않기 때문에, 리다이렉트 URL이 없는 경우에는 상태(예: accessToken)만 저장되고, 어디로 리다이렉트할지에 대한 정보는 zustand나 다른 상태 관리 도구에서 관리되지 않음)

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
      name: 'auth-storage', //저장소 이름
      storage:
        typeof window !== 'undefined' &&
        window.location.hostname === 'localhost'
          ? createJSONStorage(() => localStorage) // 개발환경에서는 로컬스토리지 사용
          : createJSONStorage(() => sessionStorage), // 배포 환경에서는 세션스토리지 사용
    }
  )
)

// 희성님 코드
// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'

// type AuthState = {
//   count: number
//   increase: () => void
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       count: 0,
//       increase: () => set((state: AuthState) => ({ count: state.count + 1 })),
//     }),
//     {
//       name: 'my-session-store',
//       storage: {
//         getItem: (name) => {
//           const stored = sessionStorage.getItem(name)
//           return stored ? JSON.parse(stored) : null
//         },
//         setItem: (name, value) =>
//           sessionStorage.setItem(name, JSON.stringify(value)),
//         removeItem: (name) => sessionStorage.removeItem(name),
//       },
//     }
//   )
// )
