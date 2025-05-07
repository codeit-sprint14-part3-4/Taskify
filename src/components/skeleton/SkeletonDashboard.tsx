import React from 'react'
import styles from '@/pages/dashboard/[id]/dashboard.module.css'

export default function SkeletonDashboard() {
  return (
    <div className={`${styles.container} animate-pulse`}>
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="
      bg-[var(--white-FFFFFF)] border border-gray-200 rounded-lg
      px-[2rem] py-[1.6rem]
      w-[27.2rem] md:w-[55.4rem] lg:w-[27.2rem]
      h-auto flex flex-col gap-[1.6rem]
      mx-[2.4rem] md:mx-0 mb-[6rem]
    "
        >
          <div className="bg-gray-200 h-[2.4rem] w-[70%] rounded" />

          {[...Array(3)].map((_, cardIdx) => (
            <div
              key={cardIdx}
              className="bg-gray-200 h-[16rem] w-full rounded"
            />
          ))}
        </div>
      ))}

      <div className={styles.addColumnWrapper}>
        <div className="bg-[var(--white-FFFFFF)] border border-gray-200 h-[27.2rem] w-[27.2rem] rounded-lg flex items-center justify-center mx-[2.4rem]">
          <div className="bg-gray-200 h-[2.4rem] w-[60%] rounded" />
        </div>
      </div>
    </div>
  )
}
