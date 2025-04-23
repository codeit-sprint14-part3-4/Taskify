export interface Member {
  id: number
  userId: number
  email: string
  nickname: string
  profileImageUrl: string
  createdAt: string
  updatedAt: string
  isOwner: boolean
}

export interface GetMembersResponse {
  members: Member[]
  totalCount: number
}
