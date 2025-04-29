import Image from 'next/image'
import Tag from '@/components/common/tag/Tag' // 개별 카드
import { CardType } from '@/types/api/cards'

// 내부에서만 사용
export interface CardProps {
  cardInfo: CardType
}

export default function Card({ cardInfo }: CardProps) {
  return (
    <div className="w-full rounded-md bg-white shadow-sm overflow-hidden">
      {/* 이미지: 현재 props로 받은 imageUrl 사용,
      추후 카드 상세 모달에서 이미지 업로드 API 연동 예정 */}
      {cardInfo.imageUrl && (
        <div className="pt-[1.6rem] px-[2rem]">
          <Image
            src={cardInfo.imageUrl}
            alt="카드 이미지"
            className="w-full h-[16rem] object-cover"
            width={500}
            height={0}
          />
        </div>
      )}

      <div className="pt-[1.6rem] pb-[1.6rem] px-[2rem] flex flex-col gap-2">
        {/* 제목: 현재는 title props 그대로 사용,
        추후 모달에서 수정 가능한 입력 필드로 연동 예정 */}
        <h4 className="text-lg-medium" style={{ color: 'var(--black-333236)' }}>
          {cardInfo.title}
        </h4>

        {/* 태그 리스트: 랜덤 스타일 태그 사용 중,
        추후 모달에서 태그 추가/삭제 및 색상 재지정 연동 예정*/}
        <div className="flex flex-wrap gap-[0.6rem]">
          {cardInfo.tags.map((tag, idx) => (
            <Tag key={idx} label={tag.label} color={tag.color} />
          ))}
        </div>

        <div
          className="flex justify-between items-center text-xs-medium"
          style={{ color: 'var(--gray-787486)' }}
        >
          <div className="flex items-center gap-1">
            <Image
              src="/assets/icon/calendar.svg"
              alt="달력 아이콘"
              width={18}
              height={18}
              className="inline-block"
            />
            {/* 날짜는 string으로 받은 값 (ex: '2025-12-31')이며,
            추후 카드 상세 모달에서 Date 객체로 변환하여 처리할 예정 */}
            <span>{cardInfo.dueDate}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* 추후 assignee.profileImageUrl로 프로필 이미지 표시 예정
              현재는 nickname 텍스트만 출력 중 */}
            {/* assignee에 프로필 이미지가 추가 안된 상태여서 에러가 나는 상황 */}
            {/* <Image
              src={cardInfo.assignee.profileImageUrl}
              alt="프로필 이미지"
              width={24}
              height={24}
              className="w-6 h-6 rounded-full object-cover"
            /> */}
          </div>
        </div>
      </div>
    </div>
  )
}
