import { Member } from '@/types/api/menmbers'
import { create } from 'zustand'

interface DashboardMember extends Member {
  badge: string
}

interface DashboardMembersState {
  members: DashboardMember[]
  setMembers: (newMembers: DashboardMember[]) => void // 멤버 스토어 통채로 수정
  addMember: (member: DashboardMember) => void // 멤버 하나 추가
  removeMember: (id: number) => void // 멤버 하나 제거
  clearMembers: () => void // 싹 다 제거
}

export const useDashboardMembers = create<DashboardMembersState>((set) => ({
  members: [],
  setMembers: (newMembers) => set({ members: newMembers }),
  addMember: (member) =>
    set((state) => ({
      members: [...state.members, member],
    })),
  removeMember: (id) =>
    set((state) => ({
      members: state.members.filter((m) => m.id !== id),
    })),
  clearMembers: () => set({ members: [] }),
}))
