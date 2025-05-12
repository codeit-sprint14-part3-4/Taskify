export interface ColumnType {
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
  data: ColumnType[]
}

export interface UploadColumnImageResponse {
  imageUrl: string
}
