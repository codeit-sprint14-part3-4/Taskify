import styles from './editMyDashboardAttribute.module.css'
import Input from '@/components/common/commoninput/CommonInput'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import { useState, useEffect } from 'react'
import ColorPin from '@/components/domain/colorpin/ColorPin'
import { dashboardsService } from '@/api/services/dashboardsServices'
import { useColorPicker } from '@/hooks/useColorPicker'
import { Dashboard } from '@/types/api/dashboards'
import { useRouter } from 'next/router'

export default function EditMyDashboardAttribute() {
  const router = useRouter()
  const id = Number(router.query.id)
  const [editText, setEditText] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const { selectedColor, handleColorSelect, COLORS } = useColorPicker()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboardData = await dashboardsService.getDashboardsDetail(id)
        setEditText(dashboardData.title)
        setNewTitle(dashboardData.title)
        const selectedColorObject = COLORS.find(
          (item) => item.color === dashboardData.color
        )
        if (selectedColorObject) {
          handleColorSelect(selectedColorObject)
        }
      } catch (error) {
        console.error('대시보드 데이터를 가져오는 중 오류 발생', error)
      }
    }
    fetchDashboardData()
  }, [id])

  const handleEditDashboardAttribute = async () => {
    if (!editText) {
      alert('대시보드 이름을 입력해주세요.')
      return
    }
    try {
      const body = {
        title: editText,
        color: String(selectedColor?.color),
      }
      await dashboardsService.putDashboards(id, body)
      alert('대시보드 수정이 완료되었습니다.')
      window.location.reload()
    } catch (error) {
      console.error('대시보드 수정 중 오류 발생', error)
    }
  }
  return (
    <div className={styles.edit_container}>
      <div className={`${styles.dashboard_edit_title_margin} text-2xl-bold`}>
        {newTitle}
      </div>
      <div className={`${styles.dashboard_edit_name_margin} text-2lg-medium`}>
        대시보드 이름
      </div>
      <Input
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        placeholder="대시보드 이름을 입력해주세요."
        disabled={false}
        padding="2.5rem 1.5rem"
        className={styles.edit_input}
      />
      <div className={styles.edit_color_pin_container}>
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

      <CommonButton
        onClick={handleEditDashboardAttribute}
        variant="primary"
        padding="1.4rem 26.8rem"
        isActive={true}
      >
        변경
      </CommonButton>
    </div>
  )
}
