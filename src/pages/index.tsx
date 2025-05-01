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
