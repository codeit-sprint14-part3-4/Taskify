export interface Column {
  id: number
  title: string
  teamId: string
  createdAt: string
  updatedAt: string
}

export interface CreateColumnBody {
  title: string
  dashboardId: number
}

export interface UpdateColumnBody {
  title: string
}

export interface GetColumnsResponse {
  result: string
  data: Column[]
}

export interface UploadColumnImageResponse {
  imageUrl: string
}
