import EditMyDashboardAttribute from '@/components/domain/mydashboard/editmydashboardattribute/EditMyDashboardAttribute'
import EditMyDashboardMember from '@/components/domain/mydashboard/editmydashboardmember/EditMyDashboardMember'
import EditMyDashboardInviteLog from '@/components/domain/mydashboard/editmydashboardinvitelog/EditMyDashboardInviteLog'
import styles from './edit.module.css'
import { useRouter } from 'next/router'
import Image from 'next/image'
import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import { dashboardsService } from '@/api/services/dashboardsServices'
import Layout from '@/components/layout/layout'
import { useState } from 'react'
import DeleteActionModal from '@/components/domain/modals/basemodal/DeleteActionModal'
import Toast from '@/components/toast/Toast'

export default function EditPage() {
  const router = useRouter()
  const dashboardId = Number(router.query.id)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [falseToast, setFalseToast] = useState(false)

  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleDashboardDelete = async () => {
    try {
      await dashboardsService.deleteDashboards(dashboardId)
      // setShowToast(true)
      alert('삭제가 완료되었습니다.')
      router.push('/mydashboard')
    } catch (error) {
      console.error('대시보드 삭제 중 오류 발생', error)
      alert('요청에 실패했습니다.')
      // setFalseToast(true)
    }
  }
  return (
    <>
      <div className={styles.edit_container}>
        <div className="mt-[2rem] ml-[2rem]">
          <button
            onClick={() => router.push(`/dashboard/${dashboardId}`)}
            type="button"
            className="active:scale-95 flex items-center gap-[0.6rem] text-[var(--black-333236)] font-[var(--font-family)] cursor-pointer"
          >
            <Image
              src="/assets/image/arrow-left.svg"
              alt="뒤로가기"
              width={16}
              height={16}
              className="w-[2.0rem] h-[2.0rem]"
            />
            <span className="text-lg-medium text-[var(--black-333236)]">
              돌아가기
            </span>
          </button>
        </div>

        {/* 테일 윈드 처리 필요 */}
        <EditMyDashboardAttribute />
        <EditMyDashboardMember />
        <EditMyDashboardInviteLog />

        <div className="ml-5">
          <ButtonDashboard
            className={`${styles.button_hover} text-2lg-medium text-[var(--black-333236)] mb-[2.0rem]`}
            /* 테일 윈드 처리 필요 */
            paddingHeight="py-[1.8rem]"
            paddingWidth="px-[9.5rem]"
            onClick={handleModalOpen}
          >
            대시보드 삭제하기
          </ButtonDashboard>

          {isModalOpen && (
            <DeleteActionModal
              size="small"
              message="정말 삭제하시겠습니까?"
              onConfirm={handleDashboardDelete}
              onCancel={handleModalClose}
              confirmLabel="삭제"
              cancelLabel="취소"
            />
          )}

          {/* {showToast && (
          <Toast
            message="삭제되었습니다."
            onClose={() => setShowToast(false)}
            type="delete"
          />
        )} */}

          {/* {falseToast && (
          <Toast
            message="요청에 실패했습니다."
            onClose={() => setFalseToast(false)}
            type="info"
          />
        )} */}
        </div>
      </div>
    </>
  )
}
EditPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout pageType="dashboard">{page}</Layout>
}
