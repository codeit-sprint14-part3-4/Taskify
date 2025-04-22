import ButtonDashboard from '@/components/common/button/ButtonDashboard'
import React, { useState } from 'react'
import Input from '@/components/common/input'
import Image from 'next/image'

export default function Home() {
  const [value, setValue] = useState('')
  return (
    <div>
      <ButtonDashboard
        variant="textOnly"
        startIcon={
          <Image
            src="../../assets/icon/add_box.svg"
            alt="아이콘"
            width={20}
            height={20}
          />
        }
      >
        추가하기
      </ButtonDashboard>

      <ButtonDashboard
        variant="iconOnly"
        aria-label="아이템 추가"
        startIcon={
          <Image
            src="/assets/icon/add_box.svg"
            alt="아이콘"
            width={24}
            height={24}
          />
        }
      />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        padding="py-4 px-6" // 내부 여백 크게
        height="h-14" // input 전체 높이 크게
        placeholder="크게 만들어진 인풋"
      />
    </div>
  )
}
