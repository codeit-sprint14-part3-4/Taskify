import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ko } from 'date-fns/locale'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import Image from 'next/image'
import Input from '@/components/common/input'
import Tag from '@/components/common/tag/Tag'
import type { TagColor } from '@/types/common/tag'
import { useRef, useState } from 'react'
import styles from '@/components/domain/modals/custom-datepicker.module.css'
import UserDropdown from '@/components/dropdown/UserDropdown'

const TAG_COLORS: TagColor[] = [
  'tag-orange',
  'tag-pink',
  'tag-blue',
  'tag-green',
  'tag-purple',
  'tag-yellow',
  'tag-red',
  'tag-teal',
  'tag-brown',
  'tag-gray',
]

export default function TaskCardCreateModal() {
  const [selectValue, setSelectValue] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [tags, setTags] = useState<{ label: string; color: TagColor }[]>([])
  const [availableColors, setAvailableColors] = useState<TagColor[]>([
    ...TAG_COLORS,
  ])
  const users = [
    { id: 1, name: '김이영', badgeColor: '#EF4444' },
    { id: 2, name: '박해일', badgeColor: '#34D399' },
    { id: 3, name: '이원구', badgeColor: '#FBBF24' },
    { id: 4, name: '이아이', badgeColor: '#22C55E' },
    { id: 5, name: '이지사', badgeColor: '#5534DA' },
  ]

  const [selectedUser, setSelectedUser] = useState(users[0])

  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleImageClick = () => {
    inputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const selectChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value)
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      const randomIndex = Math.floor(Math.random() * availableColors.length)
      const selectedColor = availableColors[randomIndex]

      setTags([...tags, { label: inputValue.trim(), color: selectedColor }])

      const newAvailableColors = availableColors.filter(
        (color) => color !== selectedColor
      )

      if (newAvailableColors.length === 0) {
        setAvailableColors([...TAG_COLORS])
      } else {
        setAvailableColors(newAvailableColors)
      }

      setInputValue('')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.7)] flex justify-center items-center">
      <div className="w-[58.4rem] bg-[var(--white-FFFFFF)] rounded-2xl">
        <div className="p-[3.2rem]">
          <h2 className="pb-[3.2rem] text-2xl-bold text-[var(--black-000000)]">
            할 일 생성
          </h2>
          <div className="flex flex-col pb-[3.2rem] gap-[0.8rem]">
            <label className="text-2lg-medium text-[var(--black-000000)]">
              담당자
            </label>
            {/* UserDropdown 바로 사용 */}
            <UserDropdown
              users={users}
              selectedUser={selectedUser}
              onChange={setSelectedUser}
            />
          </div>
          <div className="flex flex-col pb-[3.2rem] gap-[0.8rem]">
            <label className="text-2lg-medium text-[var(--black-000000)] flex items-center gap-[2px]">
              제목
              <span className="text-[var(--violet-5534DhA)] text-lg-regular leading-none translate-y-[0.3rem]">
                *
              </span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해 주세요"
              height="5rem"
              padding="1.2rem 1.6rem"
            />
          </div>
          <div className="flex flex-col pb-[3.2rem] gap-[0.8rem]">
            <label className="text-2lg-medium text-[var(--black-000000)] flex items-center gap-[2px]">
              설명
              <span className="text-[var(--violet-5534DhA)] text-lg-regular leading-none translate-y-[0.3rem]">
                *
              </span>
            </label>
            <div className="w-full min-h-[12.6rem] border border-[var(--gray-D9D9D9)] rounded-lg focus-within:border-[var(--violet-5534DhA)]">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="설명을 입력해 주세요"
                className="w-full min-h-[12.6rem] px-[1.6rem] py-[1.5rem] border border-[var(--gray-D9D9D9)] rounded-lg bg-[var(--white-FFFFFF)] text-lg-regular text-[var(--black-333236)] placeholder-[var(--gray-9FA6B2)] outline-none resize-none border-none"
                wrap="soft"
              />
            </div>
          </div>
          <div className="flex flex-col pb-[3.2rem] gap-[0.8rem]">
            <label className="text-2lg-medium text-[var(--black-000000)]">
              마감일
            </label>
            <div
              className={`group flex items-center w-full h-[5rem] px-[1.6rem] border border-[var(--gray-D9D9D9)] rounded-lg focus-within:border-[var(--violet-5534DhA)]`}
            >
              <Image
                src="/assets/icon/calendar.svg"
                alt="달력 아이콘"
                width={22}
                height={22}
                className="mr-[0.8rem]"
              />
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                dateFormat="yyyy.MM.dd HH:mm"
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                timeCaption="시간"
                placeholderText="날짜를 입력해 주세요"
                className="flex-1 bg-transparent text-lg-regular text-[var(--black-333236)] placeholder-[var(--gray-9FA6B2)] outline-none"
                calendarClassName={styles.calendar} // 캘린더 박스 스타일
                popperClassName={styles.popper} // 팝업(달력) 스타일
                dayClassName={() => styles.day} // 하루하루 날짜 스타일
                locale={ko}
              />
            </div>
          </div>
          <div className="flex flex-col pb-[3.2rem] gap-[0.8rem]">
            <label className="text-2lg-medium text-[var(--black-000000)]">
              태그
            </label>
            <div className="flex flex-wrap w-full min-h-[5rem] px-[1.6rem] py-[1rem] border border-[var(--gray-D9D9D9)] rounded-lg gap-[1rem] focus-within:border-[var(--violet-5534DhA)]">
              {tags.map((tag, idx) => (
                <Tag key={idx} label={tag.label} color={tag.color} />
              ))}

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? '입력 후 Enter' : ''}
                className="flex-1 min-w-[10rem] bg-transparent text-lg-regular text-[var(--black-333236)] placeholder-[var(--gray-9FA6B2)] outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col pb-[3.2rem] gap-[0.8rem]">
            <label className="text-2lg-medium text-[var(--black-000000)]">
              이미지
            </label>
            <div
              onClick={handleImageClick}
              className="w-[7.6rem] h-[7.6rem] relative flex items-center justify-center rounded-[0.6rem] bg-[#F5F5F5] cursor-pointer overflow-hidden"
            >
              {preview ? (
                <Image
                  src={preview}
                  alt="업로드된 이미지"
                  fill
                  className="rounded-[0.6rem] object-cover"
                />
              ) : (
                <Image
                  src="/assets/icon/add.svg"
                  alt="이미지 추가"
                  width={17}
                  height={17}
                />
              )}
            </div>
            {/* 숨겨진 파일 인풋 */}
            <input
              className="hidden"
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="w-full flex justify-center items-center gap-[0.8rem]">
            <CommonButton
              variant="secondary"
              padding="1.4rem 11.4rem"
              isActive={true}
              className="w-full h-[5.4rem] rounded-lg text-[var(--gray-787486)] text-lg-medium border border-[var(--gray-D9D9D9)]"
            >
              취소
            </CommonButton>
            <CommonButton
              variant="primary"
              padding="1.4rem 11.4rem"
              isActive={true}
              className="w-full h-[5.4rem] bg-[var(--violet-5534DhA)] text-[var(--white-FFFFFF)] text-lg-semibold"
            >
              생성
            </CommonButton>
          </div>
        </div>
      </div>
    </div>
  )
}
