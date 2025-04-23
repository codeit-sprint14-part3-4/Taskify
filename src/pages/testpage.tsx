import Button from '../components/common/button/Button'

const variants = [
  'login',
  'accept',
  'reject',
  'cancel',
  'confirm',
  'input',
  'delete',
] as const
const sizes = ['large', 'medium', 'small'] as const

export default function TestPage() {
  return (
    <div
      style={{
        backgroundColor: '#6f6d6d',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {variants.map((variant) => (
        <div key={variant}>
          <h3 style={{ marginBottom: '8px' }}>
            {variant.toUpperCase()} BUTTONS
          </h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {sizes.map((size) => (
              <Button
                key={`${variant}-${size}`}
                variant={variant}
                size={size}
                isActive={true}
                className="text-md-medium"
              >
                {variant}-{size}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
