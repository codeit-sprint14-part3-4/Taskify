import ButtonDashboard from '@/components/common/button/ButtonDashboard'
import Image from 'next/image'

export default function Home() {
  return (
    <div>
      <ButtonDashboard
        paddingHeight="py-6" // Vertical padding (Top & Bottom)
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
        paddingHeight="py-6" // Tailwind 클래스 (패딩)
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
      <div className="bg-blue-500 p-4 text-white">
        <h1 className="text-white">Tailwind CSS가 잘 적용되었는지 확인!</h1>
      </div>
    </div>
  )
}
