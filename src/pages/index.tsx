import React from 'react'
import Gnb from '@/components/layout/gnb/Gnb'
import Image from 'next/image'
import styles from './index.module.css'
import Button from '@/components/common/button/Button'

export default function Home() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Gnb />
      <div className={`${styles.maincontainer}`}>
        <section className={`${styles.homepagetop}`}>
          <div className={`${styles.homepagelogo} inline-block text-center`}>
            <Image
              src="/assets/image/desktop.svg"
              alt="Taskify Logo"
              width={772}
              height={422}
            />
          </div>
          <h1 className={`font-bold text-white ${styles.homepagemaintext}`}>
            새로운 일정 관리
            <span className={` ${styles.homepagespan}`}>Taskify</span>
          </h1>
          <Button className={`${styles.loginbutton}`}>로그인 하기</Button>
        </section>

        <section className={`${styles.pointer1}  flex-col`}>
          <span className={`${styles.pointer1text}`}>Point1</span>
          <div className={`${styles.pointer1maintext} text-left`}>
            <div>일의 우선 순위를</div>
            <div>관리하세요</div>
          </div>
        </section>

        <section className={`${styles.pointer2} flex flex-col text-left`}>
          <div className={`${styles.pointer2box}`}>
            <span className={`${styles.pointer2text}`}>Point2</span>
            <div className={`${styles.pointer2maintext}`}>
              <div>해야 할 일을</div>
              <div>등록하세요</div>
            </div>
          </div>
        </section>

        <section className="flex justify-center w-full">
          <span className={`${styles.linkcardlabel} mr-auto`}>
            생산성을 높이는 다양한 설정⚡
          </span>
        </section>

        <section className="flex flex-row text">
          <div></div>
        </section>
      </div>
    </div>
  )
}
