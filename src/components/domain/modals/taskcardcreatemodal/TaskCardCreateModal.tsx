import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ko } from 'date-fns/locale'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import Image from 'next/image'
import Input from '@/components/common/commoninput/CommonInput'
import Tag from '@/components/common/tag/Tag'
import type { TagColor } from '@/types/common/tag'
import { SetStateAction, useRef, useState } from 'react'
import UserDropdown from '@/components/dropdown/UserDropdown'
import { cardsService } from '@/api/services/cardsServices'
import { CreateCardBody } from '@/types/api/cards'
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

interface TaskCardCreateModalProps {
  dashboardId: number
  columnId: number
  handleCardCreateModalClose: () => void
  setRefreshTrigger: React.Dispatch<SetStateAction<number>>
}

export default function TaskCardCreateModal({
  dashboardId,
  columnId,
  handleCardCreateModalClose,
  setRefreshTrigger,
}: TaskCardCreateModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignee, setAssignee] = useState(-1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [tagsInput, setTagsInput] = useState('')
  const [tags, setTags] = useState<{ label: string; color: TagColor }[]>([])
  const [availableColors, setAvailableColors] = useState<TagColor[]>([
    ...TAG_COLORS,
  ])
  const [isButtonDisable, setIsButtonDisable] = useState(true)
  const dashboardMembers = useDashboardMembers((state) => state.members)
  const users = dashboardMembers.map((user) => ({
    id: user.userId,
    name: user.nickname,
    badgeColor: user.badge,
    profileImageUrl: user.profileImageUrl,
  }))

  // 변경된 부분: 처음엔 선택된 유저 없음
  const [selectedUser, setSelectedUser] = useState<
    (typeof users)[0] | undefined
  >(undefined)

  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [imgFile, setImgFile] = useState<File | undefined>()

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    if (description.trim()) {
      setIsButtonDisable(false)
    } else {
      setIsButtonDisable(true)
    }
  }

  const handleChangeDescription = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value)
    if (title.trim()) {
      setIsButtonDisable(false)
    } else {
      setIsButtonDisable(true)
    }
  }

  const handleSubmitForm = async () => {
    const bodyData: CreateCardBody = {
      dashboardId: dashboardId,
      columnId: columnId,
      title: title,
      description: description,
      tags: tags.map((tag) => tag.label), // 태그 배열 요청 바디에 넣을 수 있는 형태로 변경
    }

    // 담당자가 있으면 담당자 추가
    if (assignee != -1) {
      bodyData.assigneeUserId = assignee
    }

    // 이미지가 있으면 이미지 먼저 생성 요청
    if (imgFile) {
      // 이미지가 있다면 columnService.postColumnsImage 메서드로 이미지 생성 요청부터.
      const postImage = await columnsService.postColumnsImage(columnId, imgFile)
      bodyData.imageUrl = postImage.imageUrl
    }

    // 날짜 데이터 파싱
    if (selectedDate) {
      const date = selectedDate // Date 타입
      const parseDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(
        date.getHours()
      ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`

      bodyData.dueDate = parseDate
    }

    // 서버로 요청
    await cardsService.postCards(bodyData)

    setRefreshTrigger((prev) => prev + 1)

    handleCardCreateModalClose()
  }

  const handleImageClick = () => {
    inputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImgFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagsInput.trim() !== '') {
      const randomIndex = Math.floor(Math.random() * availableColors.length)
      const selectedColor = availableColors[randomIndex]

      setTags([...tags, { label: tagsInput.trim(), color: selectedColor }])

      const newAvailableColors = availableColors.filter(
        (color) => color !== selectedColor
      )

      if (newAvailableColors.length === 0) {
        setAvailableColors([...TAG_COLORS])
      } else {
        setAvailableColors(newAvailableColors)
      }

      setTagsInput('')
    }
  }

  const handleRemoveTag = (index: number) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index))
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.7)]"
        onClick={handleCardCreateModalClose}
      ></div>
      <div className="fixed top-1/2 left-1/2 z-50 w-[58.4rem] -translate-x-1/2 -translate-y-1/2 bg-[var(--white-FFFFFF)] rounded-2xl">
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
              mode="search"
              setAssignee={setAssignee}
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
              onChange={handleChangeTitle}
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
                onChange={handleChangeDescription}
                placeholder="설명을 입력해 주세요"
                className="w-full min-h-[12.6rem] px-[1.6rem] py-[1.5rem] border-none bg-[var(--white-FFFFFF)] text-lg-regular text-[var(--black-333236)] placeholder-[var(--gray-9FA6B2)] outline-none resize-none"
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
                locale={ko}
              />
            </div>
          </div>
          <div className="flex flex-col pb-[3.2rem] gap-[0.8rem]">
            <label className="text-2lg-medium text-[var(--black-000000)]">
              태그
            </label>
            <div className="flex flex-wrap w-full min-h-[5rem] px-[1.6rem] py-[1rem] border border-[var(--gray-D9D9D9)] rounded-lg gap-[1rem] focus-within:border-[var(--violet-5534DhA)]">
              {tags.map((tag, index) => (
                <Tag
                  key={index}
                  label={tag.label}
                  isDeletable={true}
                  onDelete={() => handleRemoveTag(index)}
                />
              ))}

              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
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
              onClick={handleCardCreateModalClose}
              variant="secondary"
              padding="1.4rem 11.4rem"
              isActive={true}
              className="w-full h-[5.4rem] rounded-lg text-[var(--gray-787486)] text-lg-medium border border-[var(--gray-D9D9D9)]"
            >
              취소
            </CommonButton>
            <CommonButton
              onClick={handleSubmitForm}
              variant="primary"
              padding="1.4rem 11.4rem"
              isActive={!isButtonDisable}
              className="w-full h-[5.4rem] bg-[var(--violet-5534DhA)] text-[var(--white-FFFFFF)] text-lg-semibold"
            >
              생성
            </CommonButton>
          </div>
        </div>
      </div>
    </>
  )
}
