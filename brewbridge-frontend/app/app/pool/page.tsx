'use client';

import { useState } from 'react';
import { PoolDashboard } from '@/components/pool/PoolDashboard';
import { LiquidityForm } from '@/components/pool/LiquidityForm';
import { PoolAnalytics } from '@/components/pool/PoolAnalytics';
import { toast } from 'sonner';
import { Chain } from '@/types/chain';

// Mock data - replace with actual data from API
const mockMetrics = {
  totalLiquidity: '$1,234,567',
  activePositions: 3,
  totalEarnings: '$12,345',
  apy: 12.5,
};

const mockAnalytics = {
  apy: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    value: 10 + Math.random() * 5,
  })).reverse(),
  volume: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    value: 100000 + Math.random() * 50000,
  })).reverse(),
  earnings: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    value: 1000 + Math.random() * 500,
  })).reverse(),
};

export default function PoolPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLiquidityAction = async (data: {
    action: 'add' | 'remove';
    chain: Chain;
    token: string;
    amount: string;
  }) => {
    try {
      setIsLoading(true);
      // TODO: Implement actual liquidity management logic
      console.log('Liquidity action:', data);
      toast.success(
        `Successfully ${data.action === 'add' ? 'added' : 'removed'} liquidity`
      );
    } catch (error) {
      console.error('Error managing liquidity:', error);
      toast.error('Failed to manage liquidity. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-[#0A0F1C]">
      <div className="bg-[#111827] rounded-lg p-6 shadow-lg border border-[#1F2937]">
        <h1 className="text-3xl font-bold text-[#E5E7EB] bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Liquidity Pool
        </h1>
        <p className="text-[#9CA3AF] mt-2">
          Manage your liquidity positions and track performance
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-[#111827] rounded-lg p-6 shadow-lg border border-[#1F2937]">
          <PoolDashboard metrics={mockMetrics} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-[#111827] rounded-lg p-6 shadow-lg border border-[#1F2937]">
            <LiquidityForm onSubmit={handleLiquidityAction} />
          </div>
          <div className="bg-[#111827] rounded-lg p-6 shadow-lg border border-[#1F2937]">
            <PoolAnalytics data={mockAnalytics} />
          </div>
        </div>
      </div>
    </div>
  );
}