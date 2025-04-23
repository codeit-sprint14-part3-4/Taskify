import ButtonDashboard from '@/components/common/button/ButtonDashboard'
import React, { useState } from 'react'
import Input from '@/components/common/input'
import Image from 'next/image'

export default function Home() {
  const [value, setValue] = useState('')
  return (
    <div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="비밀번호를 입력하세요"
        type="passward"
      />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        width="300px"
        type="date"
      />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="이메일을 입력하세요"
        type="email"
      />
    </div>
  )
}
