import styles from './dashboardlist.module.css'
import Image from 'next/image'
import ArrorRight from '../../../../public/assets/image/arrow-right.svg'
import Crown from '../../../../public/assets/icon/crown.svg'
const DashboardList = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main_wrapper}>
        <div className={styles.main_left}>
          <div>컬러</div>
          <div className={styles.main_left}>
            <div>대시보드</div>
            <div className="flex">
              <Image
                src={Crown}
                alt="Arrow Left"
                width={20}
                height={14}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div>
          <Image
            src={ArrorRight}
            alt="Arrow Left"
            width={7}
            height={14}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardList
