import React from 'react'
import Gnb from '@/components/layout/gnb/Gnb'
import Image from 'next/image'
import styles from './index.module.css'
import Button from '@/components/common/commonbutton/CommonButton'
import FeatureCard from '@/components/featurecard/FeatureCard'
import Footerbar from '@/components/layout/footerbar/Footerbar'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import AnimatedSection from '@/components/common/animatedSection/AnimatedSection'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context

  // 쿠키에서 accessToken 추출
  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return {
      props: {},
    }
  }

  try {
    // fetch를 사용한 API 호출
    const response = await fetch('${process.env.API_BASE_URL}/dashboards', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('대시보드 정보를 가져오는 데 실패했습니다.')
    }

    const dashboards = await response.json()
    //const dashboards = (await response.json()).data//

    if (!dashboards || dashboards.length === 0) {
      return {
        redirect: {
          destination: '/mydashboard',
          permanent: false,
        },
      }
    }

    // createdAt 기준으로 정렬
    dashboards.sort(
      (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    const firstDashboardId = dashboards[0].id

    return {
      redirect: {
        destination: `/dashboard/${firstDashboardId}`,
        permanent: false,
      },
    }
  } catch (err) {
    console.error('Fetch Error:', err)

    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
}

export default function Home() {
  return (
    <div className={`bg-[var(--black-000000)] min-h-screen flex flex-col`}>
      <Gnb />
      <div className={`px-[18%]`}>
        <AnimatedSection delay={0.2}>
          <section
            className={`flex flex-col items-center justify-center text-center`}
          >
            <div
              className={`relative mt-[9.4rem] mb-[4.8rem] w-[77.2rem] h-[42.2rem] inline-block text-center`}
            >
              <Image
                src="/assets/image/desktop.svg"
                alt="Taskify Logo"
                fill
                priority
              />
            </div>

            <h1
              className={`text-[7.6rem] leading-[10rem] font-bold text-white`}
            >
              새로운 일정 관리
              <span
                className={`text-[#5534da] ml-[2.8rem] text-[9rem] font-montserrat font-bold leading-[6.5rem]`}
              >
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
            className={`bg-[var(--black-171717)] w-[120rem] h-[60rem] rounded-[0.8rem] flex relative mt-[17.8rem] pt-[12.5rem] pl-[5.4rem] flex-col`}
          >
            <div
              className={`absolute right-0 bottom-0 w-[59.4rem] h-[49.7rem]`}
            >
              <Image
                src="/assets/image/landing1.svg"
                alt="landingpage image"
                fill
                priority
              />
            </div>
            <span
              className={`text-[var(--gray-9FA6B2)] text-[2.2rem] text-left font-medium font-pretendard`}
            >
              Point1
            </span>
            <div
              className={`mt-10rem text-[4.8rem] font-pretendard text-[var(--white-FFFFFF)] leading-[6.4rem] font-bold`}
            >
              <div>일의 우선 순위를</div>
              <div>관리하세요</div>
            </div>
          </section>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <section
            className={`bg-[var(--black-171717)] w-[120rem] h-[60rem] rounded-[0.8rem] font-medium flex relative mt-[17.8rem] pt-[12.5rem] pl-[5.4rem] flex-col `}
          >
            <div
              className={`absolute left-[10.8rem] bottom-0 w-[43.6rem] h-[50.2rem] `}
            >
              <Image
                src="/assets/image/landing2.svg"
                alt="landingpage image"
                fill
                priority
              />
            </div>
            <div className={`ml-[64.4rem]`}>
              <span
                className={`text-[var(--gray-9FA6B2)] text-[2.2rem] text-left font-medium font-pretendard`}
              >
                Point2
              </span>
              <div
                className={`text-[4.8rem] mt-[10rem] text-white leading-[6.4rem] font-bold font-pretendard`}
              >
                <div>해야 할 일을</div>
                <div>등록하세요</div>
              </div>
            </div>
          </section>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <div className="flex justify-center w-full">
            <span
              className={`mt-[9rem] mb-[3.6rem] text-[2.8rem] text-white font-bold mr-auto`}
            >
              생산성을 높이는 다양한 설정⚡
            </span>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <section className={`flex flex-row gap-[3.3rem]`}>
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
      <div className={`mt-[16rem]`}>
        <Footerbar />
      </div>
    </div>
  )
}
