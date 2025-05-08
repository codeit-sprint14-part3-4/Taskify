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
import { useToast } from '@/context/ToastContext'

export default function EditPage() {
  const { showToast } = useToast()
  const router = useRouter()
  const dashboardId = Number(router.query.id)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleDashboardDelete = async () => {
    try {
      await dashboardsService.deleteDashboards(dashboardId)
      showToast('삭제가 완료되었습니다.', 'success')
      router.push('/mydashboard')
    } catch (error) {
      const err = error as Error
      showToast(err.message, 'error')
    }
  }
  return (
    <>
      <div
        className={`bg-[var(--gray-FAFAFA)] flex flex-col gap-[1.6rem] ml-[2rem]`}
      >
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

        <EditMyDashboardAttribute />
        <EditMyDashboardMember />
        <EditMyDashboardInviteLog />

        <div className={`${styles.button_container}`}>
          <ButtonDashboard
            className={`${styles.delete_button} active:scale-95 
            text-2lg-medium text-[var(--black-333236)] mb-[2.0rem] 
      `}
            onClick={handleModalOpen}
          >
            대시보드 삭제하기
          </ButtonDashboard>

          {isModalOpen && (
            <DeleteActionModal
              size="small"
              message="정말 삭제하시겠습니까?"
              onDelete={handleDashboardDelete}
              onCancel={handleModalClose}
              deleteLabel="삭제"
              cancelLabel="취소"
            />
          )}
        </div>
      </div>
    </>
  )
}
EditPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout pageType="dashboard">{page}</Layout>
}
