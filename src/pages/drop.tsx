import { useState } from 'react'
import StatusDropdown, { Status } from '@/components/dropdown/StatusDropdown' // Status enum 가져오기
import UserDropdown from '@/components/dropdown/UserDropdown'

export default function TestPage() {
  const [status, setStatus] = useState<Status>(Status.TODO) // enum으로 사용
  const [selectedUser, setSelectedUser] = useState({
    id: 1,
    name: '하하',
    badgeColor: '#A3C4A2',
  })

  const users = [
    { id: 1, name: '하하', badgeColor: '#A3C4A2' },
    { id: 2, name: '김희철', badgeColor: '#EDC4A6' },
    { id: 3, name: '장동민', badgeColor: '#F5A9B8' },
  ]

  return (
    <div className="flex gap-8 p-10 mt-[-400px] justify-center items-center min-h-screen">
      <StatusDropdown value={status} onChange={setStatus} />
      <UserDropdown
        users={users}
        selectedUser={selectedUser}
        onChange={setSelectedUser}
      />
    </div>
  )
}
