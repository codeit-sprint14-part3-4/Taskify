import React from 'react'
import Image from 'next/image'
import styles from './featureCard.module.css'
import FeatureCardProps from '@/types/common/featurecard'

const FeatureCard: React.FC<FeatureCardProps> = ({
  imageSrc,
  title,
  description,
  width,
  height,
}) => {
  return (
    <div className={`${styles.featureCardFrame}`}>
      <div className={`${styles.cardboxtop}`}>
        <div className={`${styles.cardboximage}`}>
          <Image
            src={imageSrc}
            alt={title}
            width={width || 100}
            height={height || 100}
          />
        </div>
      </div>
      <div className={`${styles.cardboxbottom}`}>
        <h3 className={`${styles.cardh3}`}>{title}</h3>
        <p className={`${styles.cardtext}`}>{description}</p>
      </div>
    </div>
  )
}

export default FeatureCard
