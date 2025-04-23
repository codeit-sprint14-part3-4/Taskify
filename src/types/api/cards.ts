export interface Card {
  id: number
  title: string
  description: string
  tags: string[]
  dueDate: string
  assignee: {
    profileImageUrl: string
    nickname: string
    id: number
  }
  imageUrl: string
  teamId: string
  columnId: number
  createdAt: string
  updatedAt: string
}

export interface GetCardsResponse {
  cursorId: number
  totalCount: number
  cards: Card[]
}

export interface CreateCardBody {
  assigneeUserId: number
  dashboardId: number
  columnId: number
  title: string
  description: string
  dueDate: string
  tags: string[]
  imageUrl: string
}

export interface UpdateCardBody {
  assigneeUserId: number
  columnId: number
  title: string
  description: string
  dueDate: string
  tags: string[]
  imageUrl: string
}
