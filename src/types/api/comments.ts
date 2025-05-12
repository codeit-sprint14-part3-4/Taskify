interface CommentAuthor {
  profileImageUrl: string
  nickname: string
  id: number
}

export interface Comment {
  id: number
  content: string
  createdAt: string
  updatedAt: string
  cardId: number
  author: CommentAuthor
}

export interface GetCommentsResponse {
  cursorId: number
  comments: Comment[]
}

export interface CreateCommentBody {
  content: string
  cardId: number
  columnId: number
  dashboardId: number
}

export interface UpdateCommentBody {
  content: string
}
