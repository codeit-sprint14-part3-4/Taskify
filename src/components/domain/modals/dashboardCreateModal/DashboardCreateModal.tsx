import styles from './dashboardCreateModal.module.css'
import Input from '@/components/common/input'
import Button from '@/components/common/button/Button'
import { useState } from 'react'
import { useRouter } from 'next/router'

interface DashboardModalProps {
  onClose: () => void
}

export default function DashboardCreateModal({ onClose }: DashboardModalProps) {
  const [text, setText] = useState('')
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const router = useRouter()

  const COLORS = [
    'var(--green-7AC555)',
    'var(--purple-760DDE)',
    'var(--orange-FFA500)',
    'var(--blue-76A5EA)',
    'var(--pink-E876EA)',
  ]

  const handleCreateDashboard = () => {
    const dashboardId = '1234' /*API 로직 필요요*/
    onClose()
    router.push(`/dashboard/${dashboardId}`)
  }

  const isCreatable = text.trim() !== '' && selectedColor !== null
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={`${styles.dashboard_title_margin} text-2xl-bold`}>
          새로운 대시보드
        </div>
        <div className={`${styles.dashboard_name_margin} text-2lg-medium`}>
          대시보드 이름
        </div>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="대시보드 이름을 입력해주세요."
          disabled={false}
          padding="2.5rem 1.5rem" /*padding 사이즈를 시안에 있는 걸 넣으면 시안 이미지처럼 안나오는데..? */
          className={styles.input}
        />
        <div className={styles.colorBadge_container}>
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`${styles.colorBadge} ${
                selectedColor === color ? styles.selected : ''
              }`}
              style={{ backgroundColor: color }}
            >
              {' '}
              {selectedColor === color && (
                <span className={styles.check}>✓</span>
              )}
            </button>
          ))}
        </div>

        <div className={styles.button_container}>
          <Button
            onClick={onClose}
            variant="secondary"
            padding="1.4rem 11.4rem"
            isActive={true}
          >
            취소
          </Button>
          <Button
            onClick={handleCreateDashboard}
            variant="primary"
            padding="1.4rem 11.4rem"
            isActive={isCreatable}
          >
            생성
          </Button>
        </div>
      </div>
    </div>
  )
}
