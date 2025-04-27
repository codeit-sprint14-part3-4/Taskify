import HomeNavBar from './gnb/HomeNavBar'
import Sidebar from './sidebar/Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen">
      <div className="w-[300px] shrink-0">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1">
        <header className="h-[70px] shrink-0 border-b border-[var(--gray-D9D9D9)] bg-white">
          <HomeNavBar />
        </header>
        <main className="flex-1 bg-[var(--gray-FAFAFA)] overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
