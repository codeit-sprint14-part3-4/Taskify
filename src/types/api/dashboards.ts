export interface CreateDashboardBody {
  title: string
  color: string
}

export interface UpdateDashboardBody {
  title: string
  color: string
}

export interface Dashboard {
  id: number
  title: string
  color: string
  createdAt: string
  updatedAt: string
  createdByMe: boolean
  userId: number
}

export interface GetDashboardsResponse {
  cursorId: number
  totalCount: number
  dashboards: Dashboard[]
}

export interface CreateInvitationBody {
  email: string
}

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
  totalCount: number
  invitations: Invitation[]
}
