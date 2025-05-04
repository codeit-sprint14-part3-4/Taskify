import { motion } from 'framer-motion'
import React from 'react'
import styles from './AnimatedModalContainer.module.css'

interface AnimatedModalContainerProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
}

const AnimatedModalContainer = ({
  isLoading,
  children,
  className = '',
}: AnimatedModalContainerProps) => {
  return (
    <div className={styles.AnimatedModalContainer}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center max-w-[73rem] max-h-[90vh]">
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-500">로딩 중입니다...</p>
          </div>
        ) : (
          children
        )}
      </motion.div>
    </div>
  )
}

export default AnimatedModalContainer
