import { useState, useEffect } from 'react'
import Image from 'next/image'

import { dashboardsService } from '@/api/services/dashboardsServices'
import DashboardListButton from '@/components/domain/mydashboard/dashboardlist/DashboardListButton'
import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import Layout from '@/components/layout/layout'
import DashboardCreateModal from '@/components/domain/modals/dashboardCreateModal/DashboardCreateModal'

import styles from './mydashboard.module.css'
import MyInvitedDashboard from '@/components/domain/mydashboard/dashboardinvitedlist/MyInvitedDashboard'
import { invitationsService } from '@/api/services/invitationsServices'
import { Invitation } from '@/types/api/invitations'

interface Dashboard {
  id: number
  title: string
  color: string
  createdAt: string
  updatedAt: string
  createdByMe: boolean
  userId: number
}

export default function MyDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [invitedList, setInvitedList] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const dashboardsPerPage = 5

  // 대시보드 목록을 가져오는 함수
  const fetchDashboards = async () => {
    setLoading(true)
    try {
      const data = await dashboardsService.getDashboards(
        'pagination',
        page,
        dashboardsPerPage
      )
      setDashboards(data.dashboards)
      const totalPages = Math.ceil(data.totalCount / dashboardsPerPage)
      setTotalPages(totalPages)
    } catch (err) {
      setError('대시보드를 불러오는 데 실패했습니다.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchInvitedlist = async () => {
    setLoading(true)
    try {
      const res = await invitationsService.getInvitations()
      setInvitedList(res.invitations)
    } catch (err) {
      console.error(err)
    }
  }

  // 페이지 변경 시 대시보드 목록을 새로 고침
  useEffect(() => {
    fetchDashboards()
    fetchInvitedlist()
  }, [page])

  const handleCreateDashboardModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseDashboardModal = () => {
    setIsModalOpen(false)
  }

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  const handlePrev = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1)
    }
  }

  return (
    <div className={styles.wrapper}>
      {/* 새로운 대시보드 버튼 */}
      <ButtonDashboard
        onClick={handleCreateDashboardModal}
        paddingHeight="py-[22px]"
        paddingWidth="px-[99px]"
        gap="gap-3"
        className="text-lg-semibold"
        suffix={
          <Image
            src="/assets/icon/add-box.svg"
            alt="addbutton"
            width={20}
            height={20}
            className="object-contain flex"
          />
        }
      >
        새로운 대시보드
      </ButtonDashboard>

      {/* 로딩 상태 */}
      {loading && <div>로딩 중...</div>}

      {/* 에러 상태 */}
      {error && <div>{error}</div>}

      {/* 대시보드 목록 */}
      {dashboards.length > 0 && (
        <>
          {dashboards
            .slice((page - 1) * dashboardsPerPage, page * dashboardsPerPage)
            .map((dashboard) => (
              <DashboardListButton key={dashboard.id}>
                {dashboard.title}
                {dashboard.createdByMe && (
                  <Image
                    src="/assets/icon/crown.svg"
                    alt="크라운"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                )}
              </DashboardListButton>
            ))}

          {/* 페이지네이션 */}
          <div className={`${styles.page_wrapper} text-md-regular`}>
            <div className={styles.botton_gap}>
              <span>
                {page} 페이지 중 {totalPages}
              </span>
            </div>
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className={styles.page_button_left}
            >
              <div className={styles.crown_center}>
                <Image
                  src="/assets/image/arrow-left.svg"
                  alt="왼쪽 페이지 버튼"
                  width={6}
                  height={16}
                  className="object-contain flex"
                />
              </div>
            </button>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className={styles.page_button_right}
            >
              <div className={styles.crown_center}>
                <Image
                  src="/assets/image/arrow-right.svg"
                  alt="오른쪽 페이지 버튼"
                  width={6}
                  height={16}
                  className="object-contain flex"
                />
              </div>
            </button>
          </div>
        </>
      )}
      {invitedList && !invitedList.length ? (
        <div className={styles.invite_section}>
          <div className="flex flex-col items-center gap-[2.4rem] text-[#8c8c8c]">
            <Image
              src="/assets/icon/email.svg"
              alt="email"
              width={100}
              height={100}
            />
            <div className="text-[1.8rem]">아직 초대받은 대시보드가 없어요</div>
          </div>
        </div>
      ) : (
        <MyInvitedDashboard invitedList={invitedList} />
      )}

      {/* 대시보드 생성 모달 dfasdf*/}
      {isModalOpen && (
        <DashboardCreateModal onClose={handleCloseDashboardModal} />
      )}
    </div>
  )
}

MyDashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout pageType="mydashboard">{page}</Layout>
}
