import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ko } from 'date-fns/locale'

import CommonButton from '@/components/common/commonbutton/CommonButton'
import Input from '@/components/common/commoninput/CommonInput'
import Tag from '@/components/common/tag/Tag'
import UserDropdown from '@/components/dropdown/UserDropdown'
import StatusDropdown from '@/components/dropdown/StatusDropdown'
import type { TagColor } from '@/types/common/tag'
import { CardType } from '@/types/api/cards'
import { ColumnType } from '@/types/api/columns'
import { columnsService } from '@/api/services/columnsServices'
import { useDashboardMembers } from '@/stores/dashboardMembers'

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

function getRandomTagColor(): TagColor {
  const randomIndex = Math.floor(Math.random() * TAG_COLORS.length)
  return TAG_COLORS[randomIndex]
}

interface TaskCardEditModalProps {
  cardInfo: CardType
  dashboardId: number
  columnInfo: { columnId: number; columnTitle: string }
  handleCardEditModal: (status: boolean) => void
}

export default function TaskCardEditModal({
  cardInfo,
  dashboardId,
  columnInfo,
  handleCardEditModal,
}: TaskCardEditModalProps) {
  const [statusValue, setStatusValue] = useState<string>(columnInfo.columnTitle)
  const [title, setTitle] = useState(cardInfo.title)
  // const [selectedUser, setSelectedUser] = useState<User>()
  const [assignee, setAssignee] = useState(-1)
  const [description, setDescription] = useState(cardInfo.description)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [tags, setTags] = useState<{ label: string; color: TagColor }[]>(
    cardInfo.tags.map((tag) => ({ label: tag, color: getRandomTagColor() }))
  )
  const [availableColors, setAvailableColors] = useState<TagColor[]>([
    ...TAG_COLORS,
  ])
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const dashboardMembers = useDashboardMembers((state) => state.members)
  const users = dashboardMembers.map((user) => ({
    id: user.userId,
    name: user.nickname,
    badgeColor: user.badge,
    profileImageUrl: user.profileImageUrl,
  }))
  const currentUser = cardInfo.assignee
    ? users.filter((user) => user.id === cardInfo.assignee.id)[0]
    : undefined

  // 변경된 부분: 처음엔 선택된 유저 없음
  const [selectedUser, setSelectedUser] = useState<
    (typeof users)[0] | undefined
  >(currentUser)

  const handleStatusSelect = (value: string) => {
    setStatusValue(value)
  }

  const handleImageClick = () => inputRef.current?.click()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      const randomIndex = Math.floor(Math.random() * availableColors.length)
      const selectedColor = availableColors[randomIndex]
      setTags([...tags, { label: inputValue.trim(), color: selectedColor }])
      const newColors = availableColors.filter((c) => c !== selectedColor)
      setAvailableColors(newColors.length ? newColors : [...TAG_COLORS])
      setInputValue('')
    }
  }

  const handleRemoveTag = (index: number) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index))
  }

  const getColumns = async () => {
    const columnsData = await columnsService.getColumns(dashboardId)
    setColumns(columnsData.data)
  }

  useEffect(() => {
    getColumns()
  }, [dashboardId])

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.7)] flex justify-center items-center">
      <div className="w-[58.4rem] bg-[var(--white-FFFFFF)] rounded-2xl overflow-auto">
        <div className="p-[3.2rem]">
          <h2 className="pb-[3.2rem] text-2xl-bold text-[var(--black-333236)]">
            할 일 수정
          </h2>

          {/* 상태 + 담당자 */}
          <div className="flex w-full gap-[3.2rem]">
            {/* 상태 */}
            <div className="flex flex-col pb-[3.2rem] gap-[0.8rem] w-[21.7rem]">
              <label className="text-2lg-medium text-[var(--black-333236)]">
                상태
              </label>
              {columns && columns.length ? (
                <StatusDropdown
                  statusList={columns.map((column) => column.title)}
                  value={statusValue}
                  onChange={handleStatusSelect}
                />
              ) : null}
            </div>

            {/* 담당자 */}
            <div className="flex flex-col pb-[3.2rem] gap-[0.8rem] w-[21.7rem]">
              <label className="text-2lg-medium text-[var(--black-333236)]">
                담당자
              </label>

              <UserDropdown
                users={users}
                selectedUser={selectedUser}
                onChange={setSelectedUser}
                mode="select"
                setAssignee={setAssignee}
              />
            </div>
          </div>

          {/* 제목 */}
          <div className="flex flex-col pb-[3.2rem] gap-[0.8rem]">
            <label className="text-2lg-medium text-[var(--black-333236)] flex items-center gap-[2px]">
              제목
              <span className="text-[var(--violet-5534DhA)] text-lg-regular">
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

          {/* 설명 */}
          <div className="flex flex-col pb-[3.2rem] gap-[0.8rem]">
            <label className="text-2lg-medium text-[var(--black-333236)] flex items-center gap-[2px]">
              설명
              <span className="text-[var(--violet-5534DhA)] text-lg-regular">
                *
              </span>
            </label>
            <div className="w-full border border-[var(--gray-D9D9D9)] rounded-lg focus-within:border-[var(--violet-5534DhA)]">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="설명을 입력해 주세요"
                className="w-full px-[1.6rem] pt-[1.5rem] pb-[8.5rem] bg-[var(--white-FFFFFF)] text-lg-regular text-[var(--black-333236)] placeholder-[var(--gray-9FA6B2)] outline-none resize-none rounded-lg"
              />
            </div>
          </div>

          {/* 마감일 */}
          <div className="flex flex-col pb-[3.2rem] gap-[0.8rem]">
            <label className="text-2lg-medium text-[var(--black-333236)]">
              마감일
            </label>
            <div className="group flex items-center w-full h-[5rem] px-[1.6rem] border border-[var(--gray-D9D9D9)] rounded-lg focus-within:border-[var(--violet-5534DhA)]">
              <Image
                src="/assets/icon/calendar.svg"
                alt="달력 아이콘"
                width={22}
                height={22}
                className="mr-[0.8rem]"
              />
              <DatePicker
                selected={selectedDate}
                onChange={setSelectedDate}
                dateFormat="yyyy.MM.dd HH:mm"
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                timeCaption="시간"
                placeholderText="날짜를 입력해 주세요"
                className="flex-1 bg-transparent text-lg-regular text-[var(--black-333236)] placeholder-[var(--gray-9FA6B2)] outline-none"
                locale={ko}
              />
            </div>
          </div>

          {/* 태그 */}
          <div className="flex flex-col pb-[3.2rem] gap-[0.8rem]">
            <label className="text-2lg-medium text-[var(--black-333236)]">
              태그
            </label>
            <div className="flex flex-wrap w-full min-h-[5rem] px-[1.6rem] py-[1rem] border border-[var(--gray-D9D9D9)] rounded-lg gap-[1rem] focus-within:border-[var(--violet-5534DhA)]">
              {tags.map((tag, idx) => (
                <Tag
                  key={idx}
                  label={tag.label}
                  isDeletable
                  onDelete={() => handleRemoveTag(idx)}
                />
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

          {/* 이미지 */}
          <div className="flex flex-col pb-[3.2rem] gap-[0.8rem]">
            <label className="text-2lg-medium text-[var(--black-000000)]">
              이미지
            </label>
            <div
              className="relative w-[7.6rem] h-[7.6rem] rounded-[0.6rem] overflow-hidden cursor-pointer"
              onClick={handleImageClick}
            >
              <Image
                src={preview || '/assets/icon/example-edit-image.svg'}
                alt="업로드된 이미지"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
                <Image
                  src="/assets/icon/pen.svg"
                  alt="펜 아이콘"
                  width={17}
                  height={17}
                />
              </div>
              <input
                className="hidden"
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="w-full flex justify-center items-center gap-[0.8rem]">
            <CommonButton
              onClick={() => handleCardEditModal(false)}
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
              수정
            </CommonButton>
          </div>
        </div>
      </div>
    </div>
  )
}
