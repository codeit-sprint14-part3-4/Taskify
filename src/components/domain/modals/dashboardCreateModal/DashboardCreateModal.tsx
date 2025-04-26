import styles from './dashboardCreateModal.module.css'
import Input from '@/components/common/input'
import Button from '@/components/common/commonbutton/CommonButton'
import { useState } from 'react'
import { useRouter } from 'next/router'

interface DashboardModalProps {
  onClose: () => void
}

export default function DashboardCreateModal({ onClose }: DashboardModalProps) {
  const [text, setText] = useState('')
  const router = useRouter()
  const COLORS = [
    { id: 1, color: 'var(--green-7AC555)' },
    { id: 2, color: 'var(--purple-760DDE)' },
    { id: 3, color: 'var(--orange-FFA500)' },
    { id: 4, color: 'var(--blue-76A5EA)' },
    { id: 5, color: 'var(--pink-E876EA)' },
  ] as const
  type ColorType = (typeof COLORS)[number]
  const [selectedColor, setSelectedColor] = useState<ColorType | null>(null)

  const handleCreateDashboard = () => {
    const dashboardId = '1234' /*API 로직 필요*/
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
        <div className={styles.color_badge_container}>
          {COLORS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedColor(item)}
              className={`${styles.color_badge} ${
                selectedColor?.id === item.id ? styles.selected : ''
              }`}
              style={{ backgroundColor: item.color }}
            >
              {' '}
              {selectedColor?.id === item.id && (
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
