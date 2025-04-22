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
        placeholder="크게 만들어진 인풋"
      />

      <div className="bg-red-500 w-40 h-40">Tailwind 작동 테스트</div>
    </div>
  )
}
