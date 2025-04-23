export interface User {
  id: number
  email: string
  nickname: string
  profileImageUrl: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserBody {
  email: string
  nickname: string
  password: string
}

export interface UpdateUserBody {
  nickname: string
  profileImageUrl: string
}

export interface UploadUserImageResponse {
  profileImageUrl: string
}
