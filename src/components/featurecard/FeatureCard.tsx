import React from 'react'
import Image from 'next/image'
import styles from './featureCard.module.css'
import FeatureCardProps from '@/types/common/featurecard'

const FeatureCard: React.FC<FeatureCardProps> = ({
  imageSrc,
  title,
  description,
  imgwidth,
  imgheight,
}) => {
  return (
    <div className={`${styles.featureCardFrame}`}>
      <div className={`${styles.cardboxtop}`}>
        <div
          className={styles.cardboximage}
          style={{
            width: imgwidth,
            height: imgheight,
            position: 'relative',
          }}
        >
          <Image src={imageSrc} alt="이미지 텍스쳐" fill priority />
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
