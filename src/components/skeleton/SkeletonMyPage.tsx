import React from 'react'

export default function SkeletonMyPage() {
  return (
    <div className="flex flex-col bg-[var(--gray-FAFAFA)] min-h-[80vh] pl-[3rem] max-[1023px]:pl-[2rem] max-[767px]:pl-[1.6rem]">
      {/* 돌아가기 버튼 */}
      <div className="mt-[1rem] mb-[2rem] flex items-center gap-[0.6rem]">
        <div className="w-[1.6rem] h-[1.6rem] bg-[var(--gray-D9D9D9)] rounded-full animate-pulse" />
        <div className="w-[6rem] h-[1.6rem] bg-[var(--gray-D9D9D9)] rounded-[0.4rem] animate-pulse" />
      </div>

      <div className="flex flex-col gap-[2.4rem] max-[767px]:gap-[1rem]">
        {/* 프로필 카드 */}
        <section className="bg-[var(--white-FFFFFF)] rounded-[1.6rem] p-[3.2rem] w-[66.9rem] h-[36.6rem] max-[1023px]:w-[54.8rem] max-[767px]:w-[28.4rem] max-[767px]:h-[49.6rem]">
          <div className="w-[8rem] h-[2rem] bg-[var(--gray-D9D9D9)] rounded-[0.4rem] mb-[1.6rem] animate-pulse" />
          <div className="flex gap-[3.2rem] max-[767px]:flex-col max-[767px]:gap-[5rem]">
            <div className="w-[18.2rem] h-[18.2rem] max-[767px]:w-[10rem] max-[767px]:h-[10rem] bg-[var(--gray-D9D9D9)] rounded-[1.6rem] animate-pulse" />
            <div className="flex-1 flex flex-col">
              <div className="w-[8rem] h-[1.6rem] bg-[var(--gray-D9D9D9)] rounded-[0.4rem] mb-[0.4rem] animate-pulse" />
              <div className="h-[5rem] max-[767px]:h-[4rem] mb-[1.6rem] p-[1.5rem] border border-[var(--gray-D9D9D9)] rounded-[0.8rem] bg-transparent animate-pulse" />
              <div className="w-[8rem] h-[1.6rem] bg-[var(--gray-D9D9D9)] rounded-[0.4rem] mb-[0.4rem] animate-pulse" />
              <div className="h-[5rem] max-[767px]:h-[4rem] mb-[2.4rem] p-[1.5rem] border border-[var(--gray-D9D9D9)] rounded-[0.8rem] animate-pulse" />
              <div className="w-full min-h-[4rem] py-[1.5rem] rounded-[0.8rem] bg-[var(--gray-D9D9D9)] animate-pulse" />
            </div>
          </div>
        </section>

        {/* 비밀번호 변경 카드 */}
        <section className="bg-[var(--white-FFFFFF)] rounded-[1.6rem] p-[3.2rem] flex flex-col w-[66.9rem] h-[46.6rem] max-[1023px]:w-[54.8rem] max-[1023px]:h-[46.6rem] max-[767px]:w-[28.4rem] max-[767px]:h-[42rem]">
          <div className="w-[8rem] h-[2rem] bg-[var(--gray-D9D9D9)] rounded-[0.4rem] mb-[0.8rem] animate-pulse" />
          <div className="flex flex-col">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col mb-[0.6rem]">
                <div className="w-[8rem] h-[1.6rem] bg-[var(--gray-D9D9D9)] rounded-[0.4rem] mb-[0.4rem] animate-pulse" />
                <div className="h-[5rem] max-[767px]:h-[4rem] p-[1.5rem] border border-[var(--gray-D9D9D9)] rounded-[0.8rem] bg-transparent animate-pulse" />
              </div>
            ))}
            <div className="w-full min-h-[4rem] mt-[0.8rem] py-[1.5rem] rounded-[0.8rem] bg-[var(--gray-D9D9D9)] animate-pulse" />
          </div>
        </section>
      </div>
    </div>
  )
}
