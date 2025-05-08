import { create } from 'zustand'
import { dashboardsService } from '@/api/services/dashboardsServices'
import { Dashboard } from '@/types/api/dashboards'

interface DashboardListState {
  cursorId: number
  totalCount: number
  dashboards: Dashboard[]
  sideBarDashboards: Dashboard[]

  setDashboardList: (payload: {
    cursorId: number
    totalCount: number
    dashboards: Dashboard[]
    sideBarDashboards: Dashboard[]
  }) => void

  fetchDashboardList: (page?: number) => Promise<void> // ✅ 추가
  fetchSidebarDashboards: (page?: number) => Promise<void>
  addDashboard: (dashboard: Dashboard) => void
  removeDashboard: (id: number) => void
  clearDashboardList: () => void
}

export const useDashboardListStore = create<DashboardListState>((set) => ({
  cursorId: 0,
  totalCount: 0,
  dashboards: [], // 페이지네이션용 대시보드 목록
  sideBarDashboards: [], // 사이드바용 대시보드 목록

  setDashboardList: ({ cursorId, totalCount, dashboards }) =>
    set({ cursorId, totalCount, dashboards }),

  fetchDashboardList: async (page = 1, pageSize = 5) => {
    try {
      const res = await dashboardsService.getDashboards(
        'pagination',
        page,
        pageSize
      )
      set({
        cursorId: res.cursorId,
        totalCount: res.totalCount,
        dashboards: res.dashboards, // 대시보드 목록
      })
    } catch (err) {
      console.error('❌ fetchDashboardList error:', err)
    }
  },

  // 사이드바에서 보여줄 대시보드 목록 (고정된 12개 항목)
  fetchSidebarDashboards: async (page: number = 1) => {
    try {
      const res = await dashboardsService.getDashboards('pagination', page, 12) // page 인자를 넘겨서 12개씩 가져오기
      console.log('Fetched sidebar dashboards:', res.dashboards) // 상태 업데이트 전 확인
      set({
        sideBarDashboards: res.dashboards, // 새로운 데이터로 덮어쓰기
        totalCount: res.totalCount, // totalCount 업데이트
      })
    } catch (err) {
      console.error('❌ fetchSidebarDashboards error:', err)
    }
  },

  addDashboard: (dashboard) =>
    set((state) => ({
      dashboards: [...state.dashboards, dashboard],
      totalCount: state.totalCount + 1,
    })),

  removeDashboard: (id) =>
    set((state) => ({
      dashboards: state.dashboards.filter((d) => d.id !== id),
      totalCount: state.totalCount - 1,
    })),

  clearDashboardList: () =>
    set({
      cursorId: 0,
      totalCount: 0,
      dashboards: [],
      sideBarDashboards: [], // 사이드바 대시보드 목록도 초기화
    }),
}))
