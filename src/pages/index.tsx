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

  // // 대시보드가 존재하는 경우 첫 번째 대시보드로 리다이렉트
  // useEffect(() => {
  //   if (firstDashboardId !== null) {
  //     router.push(`/dashboard/${firstDashboardId}`)
  //   }
  // }, [firstDashboardId, router])

  // // 로그인 안 되어 있는 경우 랜딩 페이지 렌더링
  // if (accessToken && firstDashboardId === null) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <p className="text-lg font-medium text-gray-700">
  //         대시보드로 이동 중입니다...
  //       </p>
  //     </div>
  //   )
  // }

  return (
    <div className={`bg-[var(--black-000000)] min-h-screen flex flex-col`}>
      <Gnb />
      <div className={`px-0 2xl:px-[0]`}>
        <AnimatedSection delay={0.2}>
          <section
            className={`flex flex-col items-center justify-center text-center px-[6rem] 2xl:px-[5.4rem] `}
          >
            <div
              className={`md:mt-[9.4rem] md:mb-[4.8rem] mb-[2.6rem] relative 2xl:w-[77.2rem] 2xl:h-[42.2rem] md:w-[53.8rem] md:h-[31.5rem] sm:w-[40rem] sm:h-[28rem] w-[35rem] h-[28rem] inline-block text-center`}
            >
              <Image
                src="/assets/image/desktop.svg"
                alt="Taskify Logo"
                fill
                priority
                className={styles.image}
              />
            </div>

            <h1 className="font-bold text-white text-[4rem] md:text-[5.6rem] 2xl:text-[7.6rem] leading-[100%] md:leading-[10rem] [word-spacing:-0.2rem] md:whitespace-nowrap">
              <span className="block md:inline">새로운 일정 관리</span>
              <span className="block md:inline ml-0 md:ml-[2.8rem] text-[4.2rem] md:text-[6rem] 2xl:text-[9rem] text-[var(--violet-5534DhA)] font-[Montserrat] font-bold [word-spacing:-0.1rem]">
                Taskify
              </span>
            </h1>
            <Link href={'/login'}>
              <Button
                variant="primary"
                padding="1.4rem 10rem"
                isActive={true}
                className={`mt-[11.1rem]`}
              >
                로그인 하기
              </Button>
            </Link>
          </section>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <section
            className={`bg-[var(--black-171717)] xl:w-[120rem] xl:h-[60rem] md:w-[66.4rem] md:h-[97.2rem] w-[34.3rem] h-[68.6rem] rounded-[0.8rem] flex justify-self-center mt-[17.8rem] md:pt-[12.5rem] pt-[6rem] md:pl-[5.4rem] relative  flex-col`}
          >
            <div
              className={`absolute right-0 bottom-0 xl:w-[59.4rem] xl:h-[49.7rem] md:w-[51.9rem] md:h-[43.5rem]  w-[29.6rem] h-[24.8rem]`}
            >
              <Image
                src="/assets/image/landing1.svg"
                alt="landingpage image"
                fill
                priority
              />
            </div>
            <span
              className={`text-[var(--gray-9FA6B2)] md:text-[2.2rem] font-medium md:text-left font-[Pretendard] text-[1.8rem] text-center`}
            >
              Point1
            </span>
            <div
              className={`leading-[5rem] md:leading-[6.4rem] md:mt-[10rem] mt-[6.1rem] md:text-[4.8rem] md:leading-[6.4rem] md:text-left text-center text-[3.6rem] leading-[5rem] text-[var(--white-FFFFFF)] font-bold font-[Pretendard]`}
            >
              <div>일의 우선 순위를</div>
              <div>관리하세요</div>
            </div>
          </section>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <section
            className={`md:text-left text-center bg-[var(--black-171717)] xl:w-[120rem] xl:h-[60rem] md:w-[66.4rem] md:h-[97.2rem] w-[34.3rem] h-[68.6rem] rounded-[0.8rem] flex justify-self-center mt-[17.8rem] xl:pt-0 md:pt-[12.5rem] pt-[6rem] md:pl-[5.4rem] relative  flex-col`}
          >
            <div
              className={`absolute xl:left-[10.8rem] md:left-[15.2rem] left-[6.3rem] bottom-0 xl:w-[43.6rem] xl:h-[50.2rem] md:w-[36rem] md:h-[41.5rem] w-[21.7rem] h-[25rem]`}
            >
              <Image
                src="/assets/image/landing2.svg"
                alt="landingpage image"
                fill
                priority
              />
            </div>
            <div className={`xl:ml-[64.4rem] xl:mt-[12.3rem] `}>
              <span
                className={`text-[var(--gray-9FA6B2)] md:text-[2.2rem] text-[1.8rem]  font-medium  font-[Pretendard]`}
              >
                Point2
              </span>
              <div
                className={`mt-[10rem] md:text-[4.8rem] md:leading-[6.4rem] text-[3.6rem] leading-[5rem] text-[var(--white-FFFFFF)] font-bold font-[Pretendard]`}
              >
                <div>해야 할 일을</div>
                <div>등록하세요</div>
              </div>
            </div>
          </section>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <div className="flex flex-col w-full min-h-screen  ">
            <div className=" w-fit mx-auto mt-[9rem] mb-[3.6rem] xl:w-[120rem] item-center justify-center ">
              <span
                className={`md:text-[2.8rem] text-[2.2rem] font-bold text-[var(--white-FFFFFF)] `}
              >
                생산성을 높이는 다양한 설정⚡
              </span>
            </div>

            <div
              className={`flex  gap-[3.3rem] flex-col xl:flex-row items-center justify-center w-full`}
            >
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
            </div>
          </div>
        </AnimatedSection>
      </div>
      <div className={`mt-[16rem]`}>
        <Footerbar />
      </div>
    </div>
  )
}
