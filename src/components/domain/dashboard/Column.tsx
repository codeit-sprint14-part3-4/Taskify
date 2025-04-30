// 컬럼 전체 한 세트
import Image from 'next/image'
import CardTable from '@/components/domain/dashboard/CardTable'
import ButtonDashboard from '@/components/common/commonbutton/ButtonDashboard'
import { ColumnType } from '@/types/api/columns'
import { CardType } from '@/types/api/cards'
import { cardsService } from '@/api/services/cardsServices'
import { useEffect } from 'react'
import { useState } from 'react'

// 내부에서만 사용
export interface ColumnProps {
  columnInfo: ColumnType
}

export default function Column({ columnInfo }: ColumnProps) {
  const [cards, setCards] = useState<CardType[]>()

  const getCards = async () => {
    const cardsData = await cardsService.getCards(10, columnInfo.id)
    setCards(cardsData.cards)
  }

  useEffect(() => {
    getCards()
  }, [])

  return (
    <div className="min-h-[calc(100vh-4.5rem)] w-[31.4rem] bg-[var(--gray-FAFAFA)] rounded-md shadow-sm flex flex-col">
      {/* 상단: 컬럼 제목 + 카드 개수 + 설정 버튼 */}
      <div className="flex items-center justify-between px-[1.6rem] pt-[2.2rem]">
        <div className="flex items-center gap-[1.2rem]">
          <div className="flex items-center gap-[0.8rem]">
            <div className="w-[0.8rem] h-[0.8rem] bg-[#5534DA] rounded-full" />
            <span className="text-lg-medium">{columnInfo.title}</span>
          </div>

          <span className="w-[2rem] h-[2rem] rounded-[0.4rem] bg-[#EEEEEE] text-[#787486] text-xs-medium flex items-center justify-center">
            {/* && 연산자 사용 이유 : getCards는 비동기로 동작, cards가 확정적으로 동작하지 않음. cards가 있을 때만 cards.length가 동작할 수 있게 */}
            {cards && cards.length}
          </span>
        </div>
        {/* onClick 이벤트 추가 요망 */}
        <button>
          <Image
            src="/assets/icon/settings_logo.svg"
            alt="설정 아이콘"
            width={24}
            height={24}
          />
        </button>
      </div>

      {/* + 버튼 */}
      <div className="px-[2rem] pt-[2.5rem] pb-[1.6rem]">
        <ButtonDashboard
          // onclickAdd 이벤트 추가 요망
          color="bg-white"
          className="rounded-[0.6rem] w-full flex justify-center items-center py-[0.9rem]"
          prefix={
            <div className="w-[22px] h-[22px] shrink-0">
              <Image
                src="/assets/icon/add_box.svg"
                alt="카드 추가 버튼"
                width={22}
                height={22}
                unoptimized
                style={{ width: '22px', height: '22px', display: 'block' }}
              />
            </div>
          }
        />
      </div>

      {/* 카드 리스트 */}
      {cards && <CardTable cards={cards} />}
    </div>
  )
}
