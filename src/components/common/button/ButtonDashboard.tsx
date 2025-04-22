import styles from './buttonDashboard.module.css'
import clsx from 'clsx'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonDashboardProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'prefix'> {
  children?: ReactNode
  textSize?: string
  color?: string
  backgroundColor?: string
  paddingHeight?: string // Tailwind 클래스 (예: 'py-6')
  paddingWidth?: string // Tailwind 클래스 (예: 'px-6')
  prefix?: ReactNode
  suffix?: ReactNode
}

export default function ButtonDashboard({
  children,
  onClick,
  prefix,
  suffix,
  textSize,
  color,
  backgroundColor,
  paddingHeight,
  paddingWidth,
  className,
  style,
  ...rest
}: ButtonDashboardProps) {
  const buttonClass = clsx(textSize, color, backgroundColor, className)

  // 동적으로 paddingHeight, paddingWidth 클래스 적용
  // innerClass에서 paddingHeight와 paddingWidth를 동적으로 적용
  const innerClass = clsx(
    styles.buttonInner, // 고정 스타일
    paddingHeight, // 'py-6', 'py-3' 등을 동적으로 적용
    paddingWidth, // 'px-6', 'px-4' 등을 동적으로 적용
    {
      'flex justify-center items-center': !children, // 텍스트가 없으면 아이콘만 가운데 정렬
      'gap-2 flex': children, // 텍스트가 있을 때, gap을 적용하고 flex로 배치
    }
  )

  return (
    <div>
      <button
        onClick={onClick}
        className={clsx(styles.buttonWrapper, buttonClass, innerClass)}
        style={style}
        {...rest}
      >
        <div className={innerClass}>
          {prefix && <span>{prefix}</span>}
          {children && <span>{children}</span>}
          {suffix && <span>{suffix}</span>}
        </div>
      </button>
    </div>
  )
}
