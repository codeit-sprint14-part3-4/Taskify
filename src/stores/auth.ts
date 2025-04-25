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

// zustand 깃허브 예시
// import { create } from 'zustand'
// import { persist, createJSONStorage } from 'zustand/middleware'

// type BearStore = {
//   bears: number
//   addABear: () => void
// }

// export const useBearStore = create<BearStore>()(
//   persist(
//     (set, get) => ({
//       bears: 0,
//       addABear: () => set({ bears: get().bears + 1 }),
//     }),
//     {
//       name: 'food-storage', // name of the item in the storage (must be unique)
//       storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
//     }
//   )
// )
