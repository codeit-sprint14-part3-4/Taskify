import React from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from './index.module.css'

import { useAuthStore } from '@/stores/auth'
import { dashboardsService } from '@/api/services/dashboardsServices'
import Gnb from '@/components/layout/gnb/Gnb'
import Button from '@/components/common/commonbutton/CommonButton'
import FeatureCard from '@/components/featurecard/FeatureCard'
import Footerbar from '@/components/layout/footerbar/Footerbar'
import AnimatedSection from '@/components/common/animatedSection/AnimatedSection'

export default function Home() {
  const { accessToken } = useAuthStore() // 로그인 상태 확인
  const [firstDashboardId, setFirstDashboardId] = useState<number | null>(null)
  const router = useRouter()

  //  대시보드 목록을 가져와서 첫 번째 대시보드 ID를 설정
  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const res = await dashboardsService.getDashboards('pagination', 1, 1)
        if (res.dashboards.length > 0) {
          setFirstDashboardId(res.dashboards[0].id)
        }
      } catch (error) {
        console.error('대시보드 불러오기 실패:', error)
      }
    }

    if (accessToken) {
      fetchDashboards()
    }
  }, [accessToken])

  // 대시보드가 존재하는 경우 첫 번째 대시보드로 리다이렉트
  useEffect(() => {
    if (firstDashboardId !== null) {
      router.push(`/dashboard/${firstDashboardId}`)
    }
  }, [firstDashboardId, router])

  // 로그인 안 되어 있는 경우 랜딩 페이지 렌더링
  if (accessToken && firstDashboardId === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-medium text-gray-700">
          대시보드로 이동 중입니다...
        </p>
      </div>
    )
  }

  return (
    <div className={`${styles.container} min-h-screen flex flex-col`}>
      <Gnb />
      <div className={styles.maincontainer}>
        <AnimatedSection delay={0.2}>
          <section className={styles.homepagetop}>
            <div className={`${styles.homepagelogo} inline-block text-center`}>
              <Image
                src="/assets/image/desktop.svg"
                alt="Taskify Logo"
                fill
                priority
                className={styles.image}
              />
            </div>

            <h1
              className={`font-bold text-white ${styles.homepagemaintext} ${styles.line}`}
            >
              새로운 일정 관리
              <span className={` ${styles.homepagespan} ${styles.line}`}>
                Taskify
              </span>
            </h1>
            <Link href={'/login'}>
              <Button
                variant="primary"
                padding="1.4rem 10rem"
                isActive={true}
                className={styles.loginbutton}
              >
                로그인 하기
              </Button>
            </Link>
          </section>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <section className={`${styles.pointer1}  flex-col`}>
            <div className={`${styles.pointer1image}`}>
              <Image
                src="/assets/image/landing1.svg"
                alt="landingpage image"
                fill
                priority
              />
            </div>
            <span className={`${styles.pointer1text}`}>Point1</span>
            <div className={`${styles.pointer1maintext}`}>
              <div>일의 우선 순위를</div>
              <div>관리하세요</div>
            </div>
          </section>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <section className={`${styles.pointer2} flex flex-col `}>
            <div className={styles.pointer2image}>
              <Image
                src="/assets/image/landing2.svg"
                alt="landingpage image"
                fill
                priority
              />
            </div>
            <div className={styles.pointer2box}>
              <span className={styles.pointer2text}>Point2</span>
              <div className={styles.pointer2maintext}>
                <div>해야 할 일을</div>
                <div>등록하세요</div>
              </div>
            </div>
          </section>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <div className="flex justify-center w-full">
            <span className={`${styles.linkcardlabel} mr-auto`}>
              생산성을 높이는 다양한 설정⚡
            </span>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <section className={styles.cardListWrapper}>
            <FeatureCard
              imageSrc="/assets/image/landing3.svg"
              title="대시보드 설정"
              description="대시보드 사진과 이름을 변경할 수 있어요."
              imgwidth="30rem"
              imgheight="12.4rem"
            />
            <FeatureCard
              imageSrc="/assets/image/landing4.svg"
              title="초대"
              description="새로운 팀원을 초대할 수 있어요."
              imgwidth="30rem"
              imgheight="23.1rem"
            />
            <FeatureCard
              imageSrc="/assets/image/landing5.svg"
              title="구성원"
              description="구성원을 초대하고 내보낼 수 있어요."
              imgwidth="30rem"
              imgheight="19.5rem"
            />
          </section>
        </AnimatedSection>
      </div>
      <div className={styles.footerline}>
        <Footerbar />
      </div>
    </div>
  )
}
