import EditMyDashboardAttribute from '@/components/domain/mydashboard/editmydashboardattribute/EditMyDashboardAttribute'
import EditMyDashboardMember from '@/components/domain/mydashboard/editmydashboardmember/EditMyDashboardMember'
import EditMyDashboardInviteLog from '@/components/domain/mydashboard/editmydashboardinvitelog/EditMyDashboardInviteLog'
import styles from './edit.module.css'
import { useRouter } from 'next/router'
import Image from 'next/image'
import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import { dashboardsService } from '@/api/services/dashboardsServices'
import Layout from '@/components/layout/layout'
export default function EditPage() {
  const router = useRouter()
  const dashboardId = Number(router.query.id)

  const handleDashboardDelete = async () => {
    try {
      await dashboardsService.deleteDashboards(dashboardId)
      alert('대시보드 삭제가 완료되었습니다.')
      router.push('/mydashboard')
    } catch (error) {
      console.error('대시보드 삭제 중 오류 발생', error)
    }
  }
  return (
    <>
      <div className="mt-[2rem] ml-[2rem]">
        <button
          onClick={() => router.back()}
          type="button"
          className="flex items-center gap-[0.6rem] text-[var(--black-333236)] font-[var(--font-family)] cursor-pointer"
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
      <div className={styles.edit_container}>
        <EditMyDashboardAttribute />
        <EditMyDashboardMember />
        <EditMyDashboardInviteLog />
      </div>
      <div className="ml-5">
        <ButtonDashboard
          className="text-2lg-medium text-[var(--black-333236)]"
          paddingHeight="py-[1.8rem]"
          paddingWidth="px-[9.5rem]"
          onClick={handleDashboardDelete}
        >
          대시보드 삭제하기
        </ButtonDashboard>
      </div>
    </>
  )
}
EditPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout pageType="dashboard" dashboardId={1}>
      {page}
    </Layout>
  )
}
