import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import CommonButton from '@/components/common/commonbutton/CommonButton'

function NotFound() {
  return (
    <div className="relative flex flex-col justify-center items-center h-screen bg-white text-gray-800 px-4 text-center overflow-hidden">
      {/* 404 텍스트 */}
      <motion.h1
        className="text-[20rem] font-extrabold text-purple-500 leading-none z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        404
      </motion.h1>

      {/* 메시지 */}
      <motion.p
        className="text-6xl font-semibold mt-6 z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        페이지를 찾을 수 없어요
      </motion.p>

      <motion.p
        className="text-3xl text-gray-500 mt-4 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        입력하신 주소가 맞는지 다시 확인해 주세요.
      </motion.p>

      {/* 홈으로 돌아가기 버튼 */}
      <motion.div
        className="mt-10 z-10"
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Link href="/" passHref>
          <CommonButton
            variant="primary"
            padding="1.6rem 3.2rem"
            isActive={true}
          >
            홈페이지로 가기
          </CommonButton>
        </Link>
      </motion.div>

      {/* 이미지 (가로 전체 꽉 차게) */}
      <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none">
        <Image
          src="/assets/image/homepagepeople.svg"
          alt="페이지를 찾을 수 없음"
          width={1920}
          height={500}
          className="object-cover w-full h-auto"
        />
      </div>
    </div>
  )
}

export default NotFound
