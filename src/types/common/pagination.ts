export interface PaginationProps {
  current: number
  total: number
  onPageChange: (page: number) => void
}
