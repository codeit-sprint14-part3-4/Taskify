// 컬럼 전체 한 세트
import Image from 'next/image'
import CardTable from '@/components/domain/dashboard/CardTable'
import { CardInfo } from '@/components/domain/dashboard/Card'
import ButtonDashboard from '@/components/common/button/ButtonDashboard'

export interface ColumnInfo {
  id: number // 컬럼 ID (수정/삭제 시 사용), 드래그 앤 드롭에서 고유 식별자로 활용
  title: string // 컬럼 제목
  dashboardId: number // 이 컬럼이 속한 대시보드 ID, 카드 추가, 수정 시 해당 컬럼이 어느 대시보드에 포함되는지
  teamId: string // 팀 식별자, 팀 단위 요청 시 API 파라미터로 필요
  cards: CardInfo[] // 이 컬럼에 포함된 카드 리스트
  onClickAdd?: () => void // 카드 생성 버튼 핸들러
  onClickEdit?: () => void // 컬럼 설정(수정/삭제) 버튼 핸들러
}

// 내부에서만 사용
export interface ColumnProps {
  columnInfo: ColumnInfo
}

export default function Column({ columnInfo }: ColumnProps) {
  return (
    <div className="min-h-[100vh] w-[314px] bg-[var(--gray-FAFAFA)] rounded-md shadow-sm flex flex-col gap-2 pb-4">
      {/* 상단: 컬럼 제목 + 카드 개수 + 설정 버튼 */}
      <div className="flex items-center justify-between px-[16px] pt-[22px]">
        <div className="flex items-center gap-[12px]">
          <div className="flex items-center gap-[8px]">
            <div className="w-[8px] h-[8px] bg-[#5534DA] rounded-full" />
            <span className="text-sm-semibold">{columnInfo.title}</span>
          </div>

          <span className="w-[20px] h-[20px] rounded-[4px] bg-[#EEEEEE] text-[#787486] text-xs-medium flex items-center justify-center">
            {columnInfo.cards.length}
          </span>
        </div>

        <button onClick={columnInfo.onClickEdit}>
          <Image
            src="/assets/icon/settings_logo.svg"
            alt="설정 아이콘"
            width={24}
            height={24}
          />
        </button>
      </div>

      {/* + 버튼 */}
      <div className="px-[20px] pt-[25px] pb-[16px]">
        <ButtonDashboard
          onClick={columnInfo.onClickAdd}
          paddingHeight="py-[9px]"
          paddingWidth="px-[9px]"
          color="bg-white"
          className="rounded-[6px] w-full flex justify-center items-center"
          prefix={
            <Image
              src="/assets/icon/add_box.svg"
              alt="카드 추가 버튼"
              width={22}
              height={22}
            />
          }
        />
      </div>

      {/* 카드 리스트 */}
      <CardTable cards={columnInfo.cards} />
    </div>
  )
}
