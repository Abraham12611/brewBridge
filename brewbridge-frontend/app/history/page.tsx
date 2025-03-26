'use client';

import { useState } from 'react';
import { TransactionList } from '@/components/history/TransactionList';
import { TransactionDetails } from '@/components/history/TransactionDetails';
import { SUPPORTED_CHAINS, TOKENS } from '@/lib/constants';

// Temporary mock data - will be replaced with real data from API
const mockTransactions = [
  {
    id: '1',
    fromChain: SUPPORTED_CHAINS[0],
    toChain: SUPPORTED_CHAINS[1],
    amount: '1.5',
    token: {
      symbol: 'ETH',
      decimals: 18,
      address: TOKENS[SUPPORTED_CHAINS[0].id][0].address,
    },
    status: 'completed' as const,
    timestamp: Math.floor(Date.now() / 1000) - 3600,
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    sourceTxHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    destTxHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
  },
  {
    id: '2',
    fromChain: SUPPORTED_CHAINS[1],
    toChain: SUPPORTED_CHAINS[2],
    amount: '100',
    token: {
      symbol: 'USDC',
      decimals: 6,
      address: TOKENS[SUPPORTED_CHAINS[1].id][0].address,
    },
    status: 'pending' as const,
    timestamp: Math.floor(Date.now() / 1000) - 1800,
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  },
  {
    id: '3',
    fromChain: SUPPORTED_CHAINS[2],
    toChain: SUPPORTED_CHAINS[0],
    amount: '0.5',
    token: {
      symbol: 'ETH',
      decimals: 18,
      address: TOKENS[SUPPORTED_CHAINS[2].id][0].address,
    },
    status: 'failed' as const,
    timestamp: Math.floor(Date.now() / 1000) - 900,
    txHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    error: 'Insufficient gas',
  },
];

export default function HistoryPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<typeof mockTransactions[0] | null>(null);

  return (
    <div className="space-y-6 bg-[#0A0F1C]">
      <div className="bg-[#111827] rounded-lg p-6 shadow-lg border border-[#1F2937]">
        <h1 className="text-3xl font-bold text-[#E5E7EB] bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Transaction History
        </h1>
        <p className="text-[#9CA3AF] mt-2">
          View and track your bridge transactions
        </p>
      </div>

      <div className="bg-[#111827] rounded-lg p-6 shadow-lg border border-[#1F2937]">
        {selectedTransaction ? (
          <TransactionDetails
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
          />
        ) : (
          <TransactionList
            transactions={mockTransactions}
            onTransactionClick={setSelectedTransaction}
          />
        )}
      </div>
    </div>
  );
}