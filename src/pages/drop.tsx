import { useState } from 'react'
import StatusDropdown from '@/components/dropdown/StatusDropdown'
import UserDropdown from '@/components/dropdown/UserDropdown'

export default function TestPage() {
  const [status, setStatus] = useState<'To Do' | 'On Progress' | 'Done'>(
    'To Do'
  )
  const [selectedUser, setSelectedUser] = useState({
    id: 1,
    name: '하하',
    badgeColor: 'bg-green-300',
  })

  const users = [
    { id: 1, name: '하하', badgeColor: 'bg-green-300' },
    { id: 2, name: '김희철', badgeColor: 'bg-orange-300' },
    { id: 3, name: '장동민', badgeColor: 'bg-red-200' },
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
