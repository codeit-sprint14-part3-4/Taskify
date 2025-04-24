import ButtonDashboard from '@/components/common/button/ButtonDashboard'
import Image from 'next/image'
import Gnb from '@/components/layout/gnb/Gnb'

export default function Home() {
  return (
    <div>
      <Gnb />
      <ButtonDashboard
        paddingHeight="py-6"

        paddingWidth="px-21.5"
        gap="gap-4"

        className="text-2lg-bold"
        prefix={
          <Image
            src="/assets/icon/add_box.svg"
            alt="addbutton"
            width={20}
            height={20}
            className="object-contain flex"
          />
        }
      >
        새로운 컬럼 추가하기
      </ButtonDashboard>

      <ButtonDashboard

        paddingHeight="py-6"
        paddingWidth="px-21.5"

        prefix={
          <Image
            src="/assets/icon/add_box.svg"
            alt="addbutton"
            width={20}
            height={20}
            className="object-contain flex"
          />
        }
      />
      <ButtonDashboard
        paddingHeight="py-6"
        paddingWidth="px-6"

        gap="gap-3"

        suffix={
          <Image
            src="/assets/icon/add_box.svg"
            alt="addbutton"
            width={20}
            height={20}
            className="object-contain flex"
          />
        }
      >
        새로운 컬럼 추가하기
      </ButtonDashboard>
      <ButtonDashboard paddingHeight="py-3" paddingWidth="px-6">
        새로운 컬럼 추가하기
      </ButtonDashboard>

      <ButtonDashboard
        paddingHeight="py-3"
        paddingWidth="px-6"
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
  )
}
