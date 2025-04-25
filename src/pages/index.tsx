import React from 'react'
import Gnb from '@/components/layout/gnb/Gnb'
import Image from 'next/image'
import styles from './index.module.css'
import Button from '@/components/common/button/Button'
import FeatureCard from '@/components/featurecard/FeatureCard'
import Footerbar from '@/components/layout/footerbar/Footerbar'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={`${styles.container} min-h-screen flex flex-col`}>
      <Gnb />
      <div className={`${styles.maincontainer}`}>
        <section className={`${styles.homepagetop}`}>
          <div className={`${styles.homepagelogo} inline-block text-center`}>
            <Image
              src="/assets/image/desktop.svg"
              alt="Taskify Logo"
              fill
              className={styles.image}
            />
          </div>

          <h1
            className={`font-bold text-white ${styles.homepagemaintext} ${styles.line}`}
          >
            새로운 일정 관리
            <h2 className={` ${styles.homepagespan} ${styles.line}`}>
              Taskify
            </h2>
          </h1>
          <Link href={'/login'}>
            <Button
              variant="login"
              size="large"
              isActive={true}
              className={`${styles.loginbutton}`}
            >
              로그인 하기
            </Button>
          </Link>
        </section>

        <section className={`${styles.pointer1}  flex-col`}>
          <div className={`${styles.pointer1image}`}>
            <Image
              src="/assets/image/landing1.svg"
              alt="landingpage image"
              fill
            />
          </div>
          <span className={`${styles.pointer1text}`}>Point1</span>
          <div className={`${styles.pointer1maintext}`}>
            <div>일의 우선 순위를</div>
            <div>관리하세요</div>
          </div>
        </section>

        <section className={`${styles.pointer2} flex flex-col `}>
          <div className={`${styles.pointer2image}`}>
            <Image
              src="/assets/image/landing2.svg"
              alt="landingpage image"
              fill
            />
          </div>
          <div className={`${styles.pointer2box}`}>
            <span className={`${styles.pointer2text}`}>Point2</span>
            <div className={`${styles.pointer2maintext}`}>
              <div>해야 할 일을</div>
              <div>등록하세요</div>
            </div>
          </div>
        </section>
        <div className="flex justify-center w-full">
          <span className={`${styles.linkcardlabel} mr-auto`}>
            생산성을 높이는 다양한 설정⚡
          </span>
        </div>

        <section className={`${styles.cardListWrapper}`}>
          <FeatureCard
            imageSrc="/assets/image/landing3.svg"
            title="대시보드 설정"
            description="대시보드 사진과 이름을 변경할 수 있어요."
            width={300}
            height={123.87}
          />
          <FeatureCard
            imageSrc="/assets/image/landing4.svg"
            title="초대"
            description="새로운 팀원을 초대할 수 있어요."
            width={300}
            height={230.81}
          />
          <FeatureCard
            imageSrc="/assets/image/landing5.svg"
            title="구성원"
            description="구성원을 초대하고 내보낼 수 있어요."
            width={300}
            height={195.48}
          />
        </section>
      </div>
      <div className={styles.footerline}>
        <Footerbar />
      </div>
    </div>
  )
}
