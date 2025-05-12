import { motion } from 'framer-motion'
import React from 'react'
import styles from './animatedModalContainer.module.css'

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
        className={`${styles.motiondiv} ${className}`}
      >
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
            <p className={styles.loadingtext}>로딩 중입니다...</p>
          </div>
        ) : (
          children
        )}
      </motion.div>
    </div>
  )
}

export default AnimatedModalContainer
