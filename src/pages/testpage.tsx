import Tag from '@/components/common/tag/Tag'
import { useState, useEffect } from 'react'

const colors = [
  'tag-orange',
  'tag-green',
  'tag-pink',
  'tag-blue',
  'tag-purple',
  'tag-yellow',
  'tag-red',
  'tag-teal',
  'tag-brown',
  'tag-gray',
]

const labels = [
  '프로젝트',
  '일반',
  '백엔드',
  '상',
  '디자인',
  '마케팅',
  '긴급',
  'API',
  '기획',
  '기타',
]

export default function TestPage() {
  const [shuffledTags, setShuffledTags] = useState<
    { label: string; color: string }[]
  >([])

  useEffect(() => {
    // 색 리스트를 복사하고
    let availableColors = [...colors]

    // label마다 랜덤 색 배정
    const result = labels.map((label) => {
      // 랜덤 인덱스 뽑기
      const randomIndex = Math.floor(Math.random() * availableColors.length)
      const color = availableColors[randomIndex]

      // 선택한 색을 사용한 색 목록에서 제거
      availableColors.splice(randomIndex, 1)

      return { label, color }
    })

    setShuffledTags(result)
  }, [])

  return (
    <div style={{ padding: '100px' }}>
      <h1
        className="text-3xl-semibold"
        style={{ color: 'var(--green-7AC555)' }}
      >
        테스트 Tag 페이지
      </h1>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {shuffledTags.map((tag, idx) => (
          <Tag key={idx} label={tag.label} color={tag.color as any} />
        ))}
      </div>
    </div>
  )
}
