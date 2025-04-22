import ButtonDashboard from '@/components/common/button/ButtonDashboard'
import Image from 'next/image'

export default function Home() {
  return (
    <div>
      <ButtonDashboard
        variant="textOnly"
        startIcon={
          <Image
            src="../../assets/icon/add_box.svg"
            alt="아이콘"
            width={20}
            height={20}
          />
        }
      >
        추가하기
      </ButtonDashboard>

      <ButtonDashboard
        variant="iconOnly"
        aria-label="아이템 추가"
        startIcon={
          <Image
            src="/assets/icon/add_box.svg"
            alt="아이콘"
            width={24}
            height={24}
          />
        }
      />
    </div>
  )
}
