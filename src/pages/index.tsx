import React from 'react'
import Gnb from '@/components/layout/gnb/Gnb'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Gnb />
      <div className="flex flex-col items-center justify-center flex-1 text-white">
        <Image
          src="/icon/homepage-logo-icon.svg"
          alt="Taskify Logo"
          width={150}
          height={50}
        />
        <Image
          src="/image/homepagepeople.svg"
          alt="Person Illustration"
          width={500}
          height={400}
        />
      </div>
    </div>
  )
}
