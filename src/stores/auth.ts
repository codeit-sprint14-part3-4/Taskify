import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  accessToken: string | null
  setAccessToken: (token: string) => void
  clearAccessToken: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null, // 기본값 설정
      setAccessToken: (token: string) => set({ accessToken: token }), // setAccessToken 정의
      clearAccessToken: () => set({ accessToken: null }), // clearAccessToken 정의
    }),
    {
      name: 'my-session-store',
      storage: {
        getItem: (name) => {
          const stored = sessionStorage.getItem(name)
          return stored ? JSON.parse(stored) : null
        },
        setItem: (name, value) =>
          sessionStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => sessionStorage.removeItem(name),
      },
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
