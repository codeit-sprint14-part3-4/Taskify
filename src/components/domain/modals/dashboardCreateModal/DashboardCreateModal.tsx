import styles from './dashboardCreateModal.module.css'
import Input from '@/components/common/input'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { CreateDashboardBody } from '@/types/api/dashboards'
import { dashboardsService } from '@/api/services/dashboardsServices'
import { useAuthStore } from '@/stores/auth'

interface DashboardModalProps {
  onClose: () => void
}

export default function DashboardCreateModal({ onClose }: DashboardModalProps) {
  const [text, setText] = useState('')
  const router = useRouter()

  const accessToken = useAuthStore((state) => state.accessToken) //이 부분 설명 필요
  const COLORS = [
    { id: 1, color: '#7AC555' },
    { id: 2, color: '#760DDE' },
    { id: 3, color: '#FFA500' },
    { id: 4, color: '#76A5EA' },
    { id: 5, color: '#E876EA' },
  ] as const
  type ColorType = (typeof COLORS)[number]
  const [selectedColor, setSelectedColor] = useState<ColorType | null>(null)

  const handleCreateDashboard = async () => {
    const body: CreateDashboardBody = {
      title: text,
      color: selectedColor?.color || '', //색상이 선택되지 않으면 빈 문자열
    }

    if (!accessToken) {
      alert('세션에 토큰이 없습니다.')
      return
    }

    try {
      const newDashBoard = await dashboardsService.postDashboards(
        body,
        accessToken
      )
      onClose()
      router.push(`/dashboard/${newDashBoard.id}`)
    } catch (error) {
      console.error('대시보드 생성 중 오류 발생:', error)
      alert('대시보드 생성에 실패했습니다. 다시 시도해주세요.')
    }
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
          <CommonButton
            onClick={onClose}
            variant="secondary"
            padding="1.4rem 11.4rem"
            isActive={true}
          >
            취소
          </CommonButton>
          <CommonButton
            onClick={handleCreateDashboard}
            variant="primary"
            padding="1.4rem 11.4rem"
            isActive={isCreatable}
          >
            생성
          </CommonButton>
        </div>
      </div>
    </div>
  )
}
