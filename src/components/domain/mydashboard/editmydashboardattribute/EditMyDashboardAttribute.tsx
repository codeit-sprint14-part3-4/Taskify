import styles from './editMyDashboardAttribute.module.css'
import Input from '@/components/common/commoninput/CommonInput'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import { useState, useEffect } from 'react'
import ColorPin from '@/components/domain/colorpin/ColorPin'
import { dashboardsService } from '@/api/services/dashboardsServices'
import { useColorPicker } from '@/hooks/useColorPicker'

// export default function EditPage({ dashboardId }: { dashboardId: number }) {
//   const [editText, setEditText] = useState('')
//   const [selectedColor, setSelectedColor] = useState<string | null>(null)
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const dashboardData = await dashboardsService.getDashboardsDetail(
//           dashboardId
//         )
//         console.log('대시보드 데이터 오류 검증하기', dashboardData)
//         setEditText(dashboardData.title)
//         setSelectedColor(dashboardData.color)
//       } catch (error) {
//         console.error('대시보드 데이터를 가져오는 중 오류 발생', error)
//       }
//     }
//     fetchDashboardData()
//   }, [dashboardId])

//   const handleEditDashboardAttribute = async () => {
//     console.log('수정된 대시 보드 데이터 서버로 보내기 로직 필요')
//   }

//   return <div>hi</div>

// 이 부분은 API 연결 때 다시 이용해보는 걸로.. ㅠㅠ 대시 보드 수정하기 버튼을 눌렀을 때
// edit 페이지로 이동이 되는데, 그 때 dashboardId를 props로 넘겨줘야 API 작업이 가능할 것 같습니다..

export default function EditMyDashboardAttribute() {
  const [editText, setEditText] = useState('')
  const { selectedColor, handleColorSelect, COLORS } = useColorPicker()

  const handleEditDashboardAttribute = async () => {
    console.log('수정된 대시 보드 데이터 서버로 보내기 로직 필요')
  }
  return (
    <div className={styles.edit_container}>
      <div className={`${styles.dashboard_edit_title_margin} text-2xl-bold`}>
        비브리지
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
