import { SetStateAction, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ko } from 'date-fns/locale'
import styles from './taskCardEditModal.module.css'
import CommonButton from '@/components/common/commonbutton/CommonButton'
import Input from '@/components/common/commoninput/CommonInput'
import Tag from '@/components/common/tag/Tag'
import UserDropdown from '@/components/dropdown/UserDropdown'
import StatusDropdown from '@/components/dropdown/StatusDropdown'
import type { TagColor } from '@/types/common/tag'
import { CardType, UpdateCardBody } from '@/types/api/cards'
import { ColumnType } from '@/types/api/columns'
import { columnsService } from '@/api/services/columnsServices'
import { useDashboardMembers } from '@/stores/dashboardMembers'
import { cardsService } from '@/api/services/cardsServices'
import AnimatedModalContainer from '@/components/common/animatedmodalcontainer/AnimatedModalContainer'

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
  columnInfo: ColumnType
  handleCardEditModal: (status: boolean) => void
  setRefreshTrigger: React.Dispatch<SetStateAction<number>>
}

export default function TaskCardEditModal({
  cardInfo,
  dashboardId,
  columnInfo,
  handleCardEditModal,
  setRefreshTrigger,
}: TaskCardEditModalProps) {
  const [selectedColumn, setSelectedColumn] = useState<ColumnType>(columnInfo)
  const [title, setTitle] = useState(cardInfo.title)
  const [assignee, setAssignee] = useState(-1)
  const [description, setDescription] = useState(cardInfo.description)
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    cardInfo.dueDate ? new Date(cardInfo.dueDate) : null
  )

  const [inputValue, setInputValue] = useState('')
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [tags, setTags] = useState<{ label: string; color: TagColor }[]>(
    cardInfo.tags.map((tag) => ({ label: tag, color: getRandomTagColor() }))
  )
  const [availableColors, setAvailableColors] = useState<TagColor[]>([
    ...TAG_COLORS,
  ])

  const [preview, setPreview] = useState<string | null>(cardInfo.imageUrl)
  const [imgFile, setImgFile] = useState<File | undefined>()
  const inputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [IsDisable, setIsDisable] = useState(true)

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

  const handleStatusSelect = (column: ColumnType) => {
    setSelectedColumn(column)
  }

  const handleImageClick = () => inputRef.current?.click()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDisable(false)
    const file = e.target.files?.[0]
    if (file) {
      setImgFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setIsDisable(false)
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

  const handleSubmitForm = async () => {
    setIsLoading(true)
    try {
      const bodyData: UpdateCardBody = {
        columnId: selectedColumn.id,
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
        const postImage = await columnsService.postColumnsImage(
          columnInfo.id,
          imgFile
        )
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
      await cardsService.putCards(cardInfo.id, bodyData)

      setRefreshTrigger((prev) => prev + 1)

      handleCardEditModal(false)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getColumns()
  }, [dashboardId])

  return (
    <AnimatedModalContainer isLoading={isLoading}>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>할 일 수정</h2>

            <div className={styles.flexRow}>
              <div className={styles.halfWidth}>
                <label className={styles.label}>상태</label>
                {columns && columns.length ? (
                  <StatusDropdown
                    columnList={columns}
                    value={selectedColumn}
                    onChange={(column) => {
                      handleStatusSelect(column)
                      setIsDisable(column.id === columnInfo.id)
                    }}
                  />
                ) : null}
              </div>
              <div className={styles.halfWidth}>
                <label className={styles.label}>담당자</label>
                <UserDropdown
                  users={users}
                  selectedUser={selectedUser}
                  onChange={(user) => {
                    setSelectedUser(user)
                    if (
                      cardInfo.assignee &&
                      user &&
                      user.id !== cardInfo.assignee.id
                    )
                      setIsDisable(false)
                    else if (!cardInfo.assignee && user && user.id)
                      setIsDisable(false)
                    else setIsDisable(true)
                  }}
                  mode="select"
                  setAssignee={setAssignee}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                제목 <span className={styles.required}>*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (
                    e.target.value !== cardInfo.title &&
                    e.target.value.trim()
                  )
                    setIsDisable(false)
                  else setIsDisable(true)
                }}
                placeholder="제목을 입력해 주세요"
                height="5rem"
                padding="1.2rem 1.6rem"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                설명 <span className={styles.required}>*</span>
              </label>
              <div className={styles.textareaContainer}>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    if (
                      e.target.value !== cardInfo.description &&
                      e.target.value.trim()
                    )
                      setIsDisable(false)
                    else setIsDisable(true)
                  }}
                  placeholder="설명을 입력해 주세요"
                  className={styles.textarea}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>마감일</label>
              <div className={styles.datePickerWrapper}>
                <Image
                  src="/assets/icon/calendar.svg"
                  alt="달력 아이콘"
                  width={22}
                  height={22}
                />
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date)
                    if (
                      date?.toString() !== new Date(cardInfo.dueDate).toString()
                    )
                      setIsDisable(false)
                    else setIsDisable(true)
                  }}
                  dateFormat="yyyy.MM.dd HH:mm"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  timeCaption="시간"
                  placeholderText="날짜를 입력해 주세요"
                  className={styles.datePickerInput}
                  locale={ko}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>태그</label>
              <div className={styles.tagInputContainer}>
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
                  className={styles.tagInput}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>이미지</label>
              <div className={styles.imageBox} onClick={handleImageClick}>
                {preview ? (
                  <>
                    <Image
                      src={preview}
                      alt="업로드된 이미지"
                      fill
                      className={styles.imagePreview}
                    />
                    <div className={styles.imageOverlay}>
                      <Image
                        src="/assets/icon/pen.svg"
                        alt="펜 아이콘"
                        width={17}
                        height={17}
                      />
                    </div>
                  </>
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
                onClick={() => handleCardEditModal(false)}
                variant="secondary"
                isActive={true}
                className={styles.secondaryButton}
              >
                취소
              </CommonButton>
              <CommonButton
                variant="primary"
                isActive={!IsDisable}
                className={styles.primaryButton}
                onClick={handleSubmitForm}
              >
                수정
              </CommonButton>
            </div>
          </div>
        </div>
      </div>
    </AnimatedModalContainer>
  )
}
