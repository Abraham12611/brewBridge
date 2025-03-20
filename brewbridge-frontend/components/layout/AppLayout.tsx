import { Sidebar } from "./Sidebar"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#0A0F1C]">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}