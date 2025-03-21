import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { NetworkStatus } from "@/components/dashboard/NetworkStatus"

// Temporary mock data - will be replaced with real data from API
const mockData = {
  portfolio: {
    totalValue: 12500.50,
    change24h: 2.5,
    tokenBalances: [
      { chain: "Ethereum", balance: 5.2, value: 8500 },
      { chain: "Polygon", balance: 1000, value: 2500 },
      { chain: "Arbitrum", balance: 500, value: 1500 },
    ],
  },
  recentTransactions: [
    {
      id: "1",
      fromChain: "Ethereum",
      toChain: "Polygon",
      amount: 1.5,
      token: "ETH",
      status: "completed" as const,
      timestamp: "2024-03-20T10:30:00Z",
    },
    {
      id: "2",
      fromChain: "Polygon",
      toChain: "Arbitrum",
      amount: 100,
      token: "USDC",
      status: "pending" as const,
      timestamp: "2024-03-20T10:25:00Z",
    },
    {
      id: "3",
      fromChain: "Arbitrum",
      toChain: "Ethereum",
      amount: 0.5,
      token: "ETH",
      status: "failed" as const,
      timestamp: "2024-03-20T10:20:00Z",
    },
  ],
  networks: [
    {
      chain: "Ethereum",
      gasPrice: "25 Gwei",
      latency: 120,
    },
    {
      chain: "Polygon",
      gasPrice: "0.1 Gwei",
      latency: 80,
    },
    {
      chain: "Arbitrum",
      gasPrice: "0.05 Gwei",
      latency: 60,
    },
  ],
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your portfolio and recent activity
        </p>
      </div>

      <PortfolioOverview
        totalValue={mockData.portfolio.totalValue}
        change24h={mockData.portfolio.change24h}
        tokenBalances={mockData.portfolio.tokenBalances}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <QuickActions />
        <NetworkStatus networks={mockData.networks} />
      </div>

      <RecentActivity transactions={mockData.recentTransactions} />
    </div>
  )
}