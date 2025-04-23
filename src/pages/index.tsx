import ButtonDashboard from '@/components/common/button/ButtonDashboard'
import Image from 'next/image'
import Gnb from '@/components/layout/gnb/Gnb'

export default function Home() {
  return (
    <div>
      <Gnb />
      <ButtonDashboard
        paddingHeight="py-6"
        paddingWidth="px-6"
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
      <div className="bg-green-500 p-6 text-white">
        <h1 className="text-3xl font-bold">Tailwind 기본 테스트</h1>
      </div>
    </div>
  )
}
