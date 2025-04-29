import EditMyDashboardAttribute from '@/components/domain/mydashboard/editmydashboardattribute/EditMyDashboardAttribute'
import EditMyDashboardMember from '@/components/domain/mydashboard/editmydashboardmember/EditMyDashboardMember'
import EditMyDashboardInviteLog from '@/components/domain/mydashboard/editmydashboardinvitelog/EditMyDashboardInviteLog'
export default function EditPage() {
  return (
    <>
      <EditMyDashboardAttribute />
      <EditMyDashboardMember />
      <EditMyDashboardInviteLog />
    </>
  )
}
