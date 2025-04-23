export interface Invitation {
  id: number
  teamId: string
  inviteAccepted: boolean
  createdAt: string
  updatedAt: string
  inviter: {
    id: number
    email: string
    nickname: string
  }
  invitee: {
    id: number
    email: string
    nickname: string
  }
  dashboard: {
    id: number
    title: string
  }
}

export interface GetInvitationsResponse {
  cursorId: number
  invitations: Invitation[]
}

export interface UpdateInvitationBody {
  inviteAccepted: boolean
}
