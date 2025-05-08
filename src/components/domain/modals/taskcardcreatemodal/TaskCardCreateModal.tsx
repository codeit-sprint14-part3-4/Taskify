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
import { CreateCardBody, CardType } from '@/types/api/cards'
import { columnsService } from '@/api/services/columnsServices'
import { useDashboardMembers } from '@/stores/dashboardMembers'
import styles from './taskCardCreateModal.module.css'
import clsx from 'clsx'

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
  const [isButtonDisable, setIsButtonDisable] = useState(true)

  const dashboardMembers = useDashboardMembers((state) => state.members)
  const users = dashboardMembers.map((user) => ({
    id: user.userId,
    name: user.nickname,
    badgeColor: user.badge,
    profileImageUrl: user.profileImageUrl,
  }))

  const [selectedUser, setSelectedUser] = useState<
    (typeof users)[0] | undefined
  >(undefined)

  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [imgFile, setImgFile] = useState<File | undefined>()

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setIsButtonDisable(!(e.target.value.trim() && description.trim()))
  }

  const handleChangeDescription = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value)
    setIsButtonDisable(!(title.trim() && e.target.value.trim()))
  }

  const handleSubmitForm = async () => {
    const bodyData: CreateCardBody = {
      dashboardId,
      columnId,
      title,
      description,
      tags: tags.map((tag) => tag.label),
    }

    if (assignee !== -1) {
      bodyData.assigneeUserId = assignee
    }

    if (imgFile) {
      const postImage = await columnsService.postColumnsImage(columnId, imgFile)
      bodyData.imageUrl = postImage.imageUrl
    }

    if (selectedDate) {
      const date = selectedDate
      const parseDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(
        date.getHours()
      ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
      bodyData.dueDate = parseDate
    }

    const createdCard: CardType = await cardsService.postCards(bodyData)

    tags.forEach((tag) => {
      const oldKey = `tagColor_${columnId}_${tag.label}`
      const newKey = `tagColor_${createdCard.id}_${tag.label}`
      const color = sessionStorage.getItem(oldKey)
      if (color) {
        sessionStorage.setItem(newKey, color)
        sessionStorage.removeItem(oldKey)
      }
    })

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
      e.preventDefault()

      const tagLabel = tagsInput.trim()
      const randomColor =
        TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)]
      const key = `tagColor_${columnId}_${tagLabel}`

      const savedColor = sessionStorage.getItem(key)
      let color: TagColor
      if (savedColor && TAG_COLORS.includes(savedColor as TagColor)) {
        color = savedColor as TagColor
      } else {
        color = randomColor
        sessionStorage.setItem(key, color)
      }

      setTags([...tags, { label: tagLabel, color }])
      setTagsInput('')
    }
  }

  const handleRemoveTag = (index: number) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index))
  }

  return (
    <>
      <div
        className={styles.modalOverlay}
        onClick={handleCardCreateModalClose}
      ></div>
      <div className={styles.modalContainer}>
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>할 일 생성</h2>

          <div className={styles.fieldGroup}>
            <label className={clsx(`${styles.label} text-2lg-medium`)}>
              담당자
            </label>
            <UserDropdown
              users={users}
              selectedUser={selectedUser}
              onChange={setSelectedUser}
              mode="search"
              setAssignee={setAssignee}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={clsx(`${styles.label} text-2lg-medium`)}>
              제목 <span className={styles.required}>*</span>
            </label>
            <Input
              value={title}
              onChange={handleChangeTitle}
              placeholder="제목을 입력해 주세요"
              height="5rem"
              padding="1.2rem 1.6rem"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={clsx(`${styles.label} text-2lg-medium`)}>
              설명 <span className={styles.required}>*</span>
            </label>
            <div className={styles.textareaContainer}>
              <textarea
                value={description}
                onChange={handleChangeDescription}
                placeholder="설명을 입력해 주세요"
                className={styles.textarea}
                wrap="soft"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={clsx(`${styles.label} text-2lg-medium`)}>
              마감일
            </label>
            <div className={styles.datePickerWrapper}>
              <Image
                src="/assets/icon/calendar.svg"
                alt="달력 아이콘"
                width={22}
                height={22}
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
                className={styles.datePickerInput}
                locale={ko}
                popperPlacement="bottom-start"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={clsx(`${styles.label} text-2lg-medium`)}>
              태그
            </label>
            <div className={styles.tagInputContainer}>
              {tags.map((tag, idx) => (
                <Tag
                  key={idx}
                  label={tag.label}
                  color={tag.color}
                  isDeletable
                  onDelete={() => handleRemoveTag(idx)}
                />
              ))}
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? '입력 후 Enter' : ''}
                className={styles.tagInput}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={clsx(`${styles.label} text-2lg-medium`)}>
              이미지
            </label>
            <div className={styles.imageBox} onClick={handleImageClick}>
              {preview ? (
                <Image
                  src={preview}
                  alt="업로드된 이미지"
                  fill
                  className={styles.imagePreview}
                />
              ) : (
                <Image
                  src="/assets/icon/add.svg"
                  alt="이미지 추가"
                  width={17}
                  height={17}
                />
              )}
              <input
                className={styles.imageInputHidden}
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <CommonButton
              onClick={handleCardCreateModalClose}
              variant="secondary"
              isActive={true}
              className={styles.secondaryButton}
            >
              취소
            </CommonButton>
            <CommonButton
              onClick={handleSubmitForm}
              variant="primary"
              isActive={!isButtonDisable}
              className={styles.primaryButton}
            >
              생성
            </CommonButton>
          </div>
        </div>
      </div>
    </>
  )
}
