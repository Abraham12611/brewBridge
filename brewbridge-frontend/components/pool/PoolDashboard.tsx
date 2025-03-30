'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, TrendingUp, Wallet2 } from 'lucide-react';

interface PoolMetrics {
  totalLiquidity: string;
  activePositions: number;
  totalEarnings: string;
  apy: number;
}

interface PoolDashboardProps {
  metrics: PoolMetrics;
}

export function PoolDashboard({ metrics }: PoolDashboardProps) {
  const metricsData = [
    {
      title: 'Total Liquidity',
      value: metrics.totalLiquidity,
      icon: Coins,
      description: 'Total value locked across all positions',
    },
    {
      title: 'Active Positions',
      value: metrics.activePositions.toString(),
      icon: Wallet2,
      description: 'Number of active liquidity positions',
    },
    {
      title: 'Total Earnings',
      value: metrics.totalEarnings,
      icon: TrendingUp,
      description: `Current APY: ${metrics.apy.toFixed(2)}%`,
    },
  ];

  return (
    <Card className="bg-[#111827] border-[#1F2937]">
      <CardHeader>
        <CardTitle className="text-[#E5E7EB]">Liquidity Provider Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {metricsData.map((metric) => (
            <Card key={metric.title} className="bg-[#0A0F1C] border-[#1F2937] hover:border-[#374151] transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <metric.icon className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-[#9CA3AF]">{metric.title}</p>
                    <h3 className="text-2xl font-bold text-[#E5E7EB]">{metric.value}</h3>
                    <p className="text-sm text-[#6B7280] mt-1">
                      {metric.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}