import styles from './homenavbar.module.css'
import ButtonDashboard from '@/components/common/button/ButtonDashboard'
import Image from 'next/image'

import clsx from 'clsx'
export default function HomeNavBar() {
  return (
    <div className={styles.flexcenterspacebetween}>
      <div className={styles.flexcenterspacebetween}>
        <div className="pl-10 pr-2">제목</div>
        <div>왕관(필수아님)</div>
      </div>
      <div className={styles.flexcenterspacebetween}>
        <div className={clsx(styles.flexcenterspacebetween, 'pr-8 ')}>
          <div className="pr-4">
            <ButtonDashboard
              paddingHeight="py-2"
              paddingWidth="px-4"
              gap="gap-2"
              style={{ color: 'var(--gray-787486)' }}
              prefix={
                <Image
                  src="/assets/icon/add_box_gray.svg"
                  alt="addbutton"
                  width={20}
                  height={20}
                  className="object-contain flex"
                />
              }
            >
              관리
            </ButtonDashboard>
          </div>
          <div className="pr-10">
            <ButtonDashboard
              paddingHeight="py-2"
              paddingWidth="px-4"
              gap="gap-2"
              style={{ color: 'var(--gray-787486)' }}
              prefix={
                <Image
                  src="/assets/icon/add_box_gray.svg"
                  alt="addbutton"
                  width={20}
                  height={20}
                  className="object-contain flex"
                />
              }
            >
              초대하기
            </ButtonDashboard>
          </div>
          <div>몇명일까요잉</div>
        </div>
        <div className={styles.flexcenterspacebetween}>
          <div className="pl-8 border-l border-var(--gray-D9D9D9) flex items-center">
            마크
          </div>
          <div className="pl-10 pr-20">이름</div>
        </div>
      </div>
    </div>
  )
}
