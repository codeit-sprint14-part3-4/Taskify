import EditMyDashboardAttribute from '@/components/domain/mydashboard/editmydashboardattribute/EditMyDashboardAttribute'
import EditMyDashboardMember from '@/components/domain/mydashboard/editmydashboardmember/EditMyDashboardMember'
import EditMyDashboardInviteLog from '@/components/domain/mydashboard/editmydashboardinvitelog/EditMyDashboardInviteLog'
import styles from './edit.module.css'
export default function EditPage() {
  const handleLouterPrev = () => {
    console.log('이전 페이지로 이동하는 로직 작성하기')
  }

  const handleDashboardDelete = () => {
    console.log('대시보드 삭제하는 로직 작성하기')
  }
  return (
    <>
      <button onClick={handleLouterPrev}>돌아가기</button>
      <div className={styles.edit_container}>
        <EditMyDashboardAttribute />
        <EditMyDashboardMember />
        <EditMyDashboardInviteLog />
      </div>
      <button onClick={handleDashboardDelete}>대시보드 삭제하기</button>
    </>
  )
}
// EditPage.getLayout = function getLayout(page: React.ReactElement) {
//   return (
//     <Layout pageType="dashboard" dashboardId={1}>
//       {page}
//     </Layout>
//   )
// }
