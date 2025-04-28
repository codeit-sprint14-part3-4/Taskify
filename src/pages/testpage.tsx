import DashboardList from '@/components/domain/mydashboard/DashboardList'
import styles from './testpage.module.css'

import InvitedList from '@/components/domain/mydashboard/InvitedList'

export default function MyDashboard() {
  return (
    <div className={styles.invite_section}>
      <InvitedList />
      <DashboardList />
    </div>
  )
}
