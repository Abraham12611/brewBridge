import { LayoutDashboard, ArrowLeftRight, History as HistoryIcon, Droplets, Settings } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Bridge', href: '/app/bridge', icon: ArrowLeftRight },
  { name: 'History', href: '/app/history', icon: HistoryIcon },
  { name: 'Pool', href: '/app/pool', icon: Droplets },
  { name: 'Settings', href: '/app/settings', icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border p-4">
        <Link href="/app/dashboard" className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <Image
              src="/Brew-bridge-logo.png"
              alt="BrewBridge Logo"
              width={32}
              height={32}
              className="w-full h-full"
              priority
            />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-[#00C2FF] to-[#7B00FF] bg-clip-text text-transparent">
            BrewBridge
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}