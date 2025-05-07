import styles from './dashboardCreateModal.module.css'
import Input from '@/components/common/commoninput/CommonInput'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { CreateDashboardBody } from '@/types/api/dashboards'
import { dashboardsService } from '@/api/services/dashboardsServices'
import ColorPin from '@/components/domain/colorpin/ColorPin'
import { useColorPicker } from '@/hooks/useColorPicker'

interface DashboardModalProps {
  onClose: () => void
}

export default function DashboardCreateModal({ onClose }: DashboardModalProps) {
  const [text, setText] = useState('')
  const router = useRouter()

  const { selectedColor, handleColorSelect, COLORS } = useColorPicker()

  const handleCreateDashboard = async () => {
    const body: CreateDashboardBody = {
      title: text,
      color: selectedColor?.color || '', //색상이 선택되지 않으면 빈 문자열
    }

    try {
      const newDashBoard = await dashboardsService.postDashboards(body)
      onClose()
      router.push(`/dashboard/${newDashBoard.id}`)
    } catch (error) {
      const err = error as Error
      alert(err.message || '대시보드 생성에 실패했습니다. 다시 시도해주세요.')
      console.error('대시보드 생성 중 오류 발생:', error)
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
          padding="2.5rem 1.5rem"
          className={styles.input}
        />
        <div className={styles.color_pin_container}>
          {COLORS.map((item) => (
            <ColorPin
              key={item.id}
              id={item.id}
              color={item.color}
              isSelected={selectedColor?.id === item.id}
              onClick={() => handleColorSelect(item)}
            ></ColorPin>
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
