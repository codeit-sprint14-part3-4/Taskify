import CommonButton from '@/components/common/commonbutton/CommonButton'
import Image from 'next/image'
import Input from '@/components/common/input'
import Tag from '@/components/common/tag/Tag'
import type { TagColor } from '@/types/common/tag'
import { useState } from 'react'

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

interface TaskCardEditModalProps {
  cardInfo: {
    status: string
    assignee: string
    title: string
    description: string
    dueDate: string
    tags: { label: string; color: TagColor }[]
    imageUrl: string
  }
}

export default function TaskCardEditModal({
  cardInfo,
}: TaskCardEditModalProps) {
  const [statusValue, setStatusValue] = useState(cardInfo.status)
  const [selectValue, setSelectValue] = useState(cardInfo.assignee)
  const [title, setTitle] = useState(cardInfo.title)
  const [description, setDescription] = useState(cardInfo.description)
  const [inputValue, setInputValue] = useState('')
  const [tags, setTags] = useState(cardInfo.tags)
  const [availableColors, setAvailableColors] = useState<TagColor[]>([
    ...TAG_COLORS,
  ])

  const statusSelectChangeHandler = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusValue(e.target.value)
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
      <div className="w-[58.4rem] max-h-[calc(100vh-10rem)] bg-[var(--white-FFFFFF)] rounded-2xl overflow-auto">
        <div className="p-[3.2rem]">
          <h2 className="pb-[3.2rem] text-2xl-bold text-[var(--black-333236)]">
            할 일 수정
          </h2>
          {/* 상태 + 담당자 드롭다운 가로 정렬 */}
          <div className="flex w-full gap-[3.2rem]">
            {/* 상태 드롭다운 추가 */}
            <div className="flex flex-col pb-[3.2rem] gap-[0.8rem]">
              <label className="text-2lg-medium text-[var(--black-333236)]">
                상태
              </label>
              <select
                value={statusValue}
                onChange={statusSelectChangeHandler}
                className={`w-full h-[4.8rem] px-[1.6rem] py-[1.1rem] border border-[var(--gray-D9D9D9)] rounded-md text-lg-regular outline-none
                  ${
                    statusValue === ''
                      ? 'text-[var(--gray-9FA6B2)]'
                      : 'text-[var(--black-333236)]'
                  }
                  focus:border-[var(--violet-5534DhA)] focus:ring-0 focus:outline-none
                `}
              >
                <option value="" disabled hidden>
                  상태를 선택해 주세요
                </option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {/* 담당자 드롭다운 */}
            <div className="flex flex-col pb-[3.2rem] gap-[0.8rem]">
              <label className="text-2lg-medium text-[var(--black-333236)]">
                담당자
              </label>
              <select
                value={selectValue}
                onChange={selectChangeHandler}
                className={`w-full h-[4.8rem] px-[1.6rem] py-[1.1rem] border border-[var(--gray-D9D9D9)] rounded-md text-lg-regular outline-none
                  ${
                    selectValue === ''
                      ? 'text-[var(--gray-9FA6B2)]'
                      : 'text-[var(--black-333236)]'
                  }
                  focus:border-[var(--violet-5534DhA)] focus:ring-0 focus:outline-none
                `}
              >
                <option value="" disabled hidden>
                  이름을 입력해 주세요
                </option>
                <option value="배유철">배유철</option>
              </select>
            </div>
          </div>

          {/* 제목 */}
          <div className="flex flex-col pb-[3.2rem] gap-[0.8rem]">
            <label className="text-2lg-medium text-[var(--black-333236)] flex items-center gap-[2px]">
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

          {/* 설명 */}
          <div className="flex flex-col pb-[3.2rem] gap-[0.8rem]">
            <label className="text-2lg-medium text-[var(--black-333236)] flex items-center gap-[2px]">
              설명
              <span className="text-[var(--violet-5534DhA)] text-lg-regular leading-none translate-y-[0.3rem]">
                *
              </span>
            </label>
            <div className="w-full border border-[var(--gray-D9D9D9)] rounded-lg focus-within:border-[var(--violet-5534DhA)]">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="설명을 입력해 주세요"
                className="w-full px-[1.6rem] pt-[1.5rem] pb-[8.5rem] border-none rounded-lg bg-[var(--white-FFFFFF)] text-lg-regular text-[var(--black-333236)] placeholder-[var(--gray-9FA6B2)] outline-none resize-none"
                wrap="soft"
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
              <input
                type="text"
                placeholder="날짜를 입력해 주세요"
                className="flex-1 bg-transparent text-lg-regular text-[var(--black-333236)] placeholder-[var(--gray-9FA6B2)] outline-none"
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

          {/* 이미지 */}
          <div className="flex flex-col pb-[3.2rem] gap-[0.8rem]">
            <label className="text-2lg-medium text-[var(--black-000000)]">
              이미지
            </label>
            <div className="relative w-[7.6rem] h-[7.6rem] rounded-[0.6rem] overflow-hidden cursor-pointer">
              {/* 현재 직접 이미지 첨부 */}
              <Image
                src="/assets/icon/example-edit-image.svg"
                alt="example image"
                width={76}
                height={76}
              />
              <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
                <Image
                  src="/assets/icon/pen.svg"
                  alt="펜 아이콘"
                  width={17}
                  height={17}
                />
              </div>
            </div>
          </div>

          {/* 버튼 */}
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
              수정
            </CommonButton>
          </div>
        </div>
      </div>
    </div>
  )
}
