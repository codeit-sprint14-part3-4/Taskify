import Tag from '@/components/common/tag/Tag'

export default function TestPage() {
  return (
    <div style={{ padding: '100px' }}>
      <h1
        className="text-3xl-semibold"
        style={{ color: 'var(--green-7AC555)' }}
      >
        테스트 Tag 페이지
      </h1>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Tag label="프로젝트" color="tag-orange" />
        <Tag label="일반" color="tag-green" />
        <Tag label="백엔드" color="tag-pink" />
        <Tag label="상" color="tag-blue" />
      </div>
    </div>
  )
}
