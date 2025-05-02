import styles from './dashboardlist.module.css'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import DashBoardListButton from './DashboardListButton'

interface Dashboard {
  id: number
  title: string
  color: string
  createdAt: string
  updatedAt: string
  createdByMe: boolean
  userId: number
}

export default function MyDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [dashboards, setDashboards] = useState<Dashboard[]>([]) // Assuming you're fetching this data from API or similar
  const dashboardsPerPage = 5
  const totalPages = Math.ceil(dashboards.length / dashboardsPerPage)

  const fetchDashboards = async () => {
    // Simulate an API call to get dashboards
    // You can replace this with an actual API call or use your actual data.
    const fetchedDashboards: Dashboard[] = await fetchData()
    setDashboards(fetchedDashboards)
  }

  const fetchData = async (): Promise<Dashboard[]> => {
    // Example data fetching logic
    return [
      {
        id: 1,
        title: 'Dashboard 1',
        color: 'blue',
        createdAt: '2022-01-01',
        updatedAt: '2022-01-01',
        createdByMe: true,
        userId: 1,
      },
      {
        id: 2,
        title: 'Dashboard 2',
        color: 'red',
        createdAt: '2022-01-01',
        updatedAt: '2022-01-01',
        createdByMe: false,
        userId: 2,
      },
      // Add more dummy data as needed
    ]
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboards()
  }, [])

  const handleCreateDashboardModal = () => {
    setIsModalOpen(true)
  }

  const handleNext = () => {
    if (page < totalPages) setPage((prevPage) => prevPage + 1)
  }

  const handlePrev = () => {
    if (page > 1) setPage((prevPage) => prevPage - 1)
  }

  const currentDashboards = dashboards.slice(
    (page - 1) * dashboardsPerPage,
    page * dashboardsPerPage
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.invite_section}>
        {currentDashboards.map((dashboard) => (
          <DashBoardListButton
            key={dashboard.id}
            suffix={
              dashboard.createdByMe && (
                <Image
                  src="/assets/icon/crown.svg"
                  alt="크라운"
                  width={16}
                  height={16}
                  className="object-contain"
                />
              )
            }
          >
            {dashboard.title}
          </DashBoardListButton>
        ))}
        <div className={`${styles.page_wrapper} text-md-regular`}>
          <div className={styles.botton_gap}>
            <span>
              {page} 페이지 중 {totalPages}
            </span>
          </div>
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={styles.page_button_left}
          >
            <div className={styles.crown_center}>
              <Image
                src="/assets/icon/arrow-left.svg"
                alt="왼쪽 페이지 버튼"
                width={6}
                height={16}
                className="object-contain"
              />
            </div>
          </button>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className={styles.page_button_right}
          >
            <div className={styles.crown_center}>
              <Image
                src="/assets/icon/arrow-right.svg"
                alt="오른쪽 페이지 버튼"
                width={6}
                height={16}
                className="object-contain"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
