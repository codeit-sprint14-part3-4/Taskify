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
] as const

type TagColor = (typeof colors)[number]

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

interface ShuffledTag {
  label: string
  color: TagColor
}


export default function TestPage() {
  const [shuffledTags, setShuffledTags] = useState<ShuffledTag[]>([])

  useEffect(() => {
    const savedTags = localStorage.getItem('shuffledTags')

    if (savedTags) {
      setShuffledTags(JSON.parse(savedTags))
    } else {
      const shuffledColors = [...colors].sort(() => Math.random() - 0.5)

      const result: ShuffledTag[] = labels.map((label, idx) => {
        const color = shuffledColors[idx % shuffledColors.length]
        return { label, color }
      })

      localStorage.setItem('shuffledTags', JSON.stringify(result))
      setShuffledTags(result)
    }
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
          <Tag key={idx} label={tag.label} color={tag.color} />
        ))}
      </div>
    </div>
  )
}
