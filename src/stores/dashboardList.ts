import { create } from 'zustand'
import { Invitation } from '@/types/api/invitations'

interface DashboardInvitationsState {
  invitations: Invitation[] // 초대 목록
  setInvitations: (newInvitations: Invitation[]) => void // 초대 목록 업데이트
  addInvitation: (invitation: Invitation) => void // 초대 추가
  removeInvitation: (invitationId: number) => void // 초대 삭제
  clearInvitations: () => void // 초대 목록 초기화
}

export const useDashboardInvitations = create<DashboardInvitationsState>(
  (set) => ({
    invitations: [], // 기본적으로 초대 목록은 비어있음
    setInvitations: (newInvitations) => set({ invitations: newInvitations }), // 초대 목록 업데이트
    addInvitation: (invitation) =>
      set((state) => ({
        invitations: [...state.invitations, invitation], // 새로운 초대 추가
      })),
    removeInvitation: (invitationId) =>
      set((state) => ({
        invitations: state.invitations.filter(
          (invitation) => invitation.id !== invitationId
        ), // 초대 삭제
      })),
    clearInvitations: () => set({ invitations: [] }), // 초대 목록 초기화
  })
)
