import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatAmount, formatDate } from '@/lib/utils';
import { Chain } from '@/lib/constants';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Transaction {
  id: string;
  fromChain: Chain;
  toChain: Chain;
  amount: string;
  token: {
    symbol: string;
    decimals: number;
  };
  status: 'pending' | 'confirmed' | 'completed' | 'failed';
  timestamp: number;
  txHash: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionClick: (tx: Transaction) => void;
}

const ITEMS_PER_PAGE = 10;

export function TransactionList({ transactions, onTransactionClick }: TransactionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter transactions based on search query and status
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch =
      tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.fromChain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.toChain.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Get status icon and color
  const getStatusInfo = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-500' };
      case 'pending':
        return { icon: Clock, color: 'text-yellow-500' };
      case 'confirmed':
        return { icon: Clock, color: 'text-blue-500' };
      case 'failed':
        return { icon: XCircle, color: 'text-red-500' };
      default:
        return { icon: AlertCircle, color: 'text-gray-500' };
    }
  };

  return (
    <Card className="bg-[#111827] border-[#1F2937]">
      <CardHeader>
        <CardTitle className="text-[#E5E7EB]">Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search by hash or chain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-[#0A0F1C] border-[#1F2937] text-[#E5E7EB] placeholder:text-gray-500"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-[#0A0F1C] border-[#1F2937] text-[#E5E7EB]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-[#111827] border-[#1F2937]">
              <SelectItem value="all" className="text-[#E5E7EB]">All Status</SelectItem>
              <SelectItem value="pending" className="text-[#E5E7EB]">Pending</SelectItem>
              <SelectItem value="confirmed" className="text-[#E5E7EB]">Confirmed</SelectItem>
              <SelectItem value="completed" className="text-[#E5E7EB]">Completed</SelectItem>
              <SelectItem value="failed" className="text-[#E5E7EB]">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {paginatedTransactions.map((tx) => {
            const { icon: StatusIcon, color } = getStatusInfo(tx.status);
            return (
              <div
                key={tx.id}
                onClick={() => onTransactionClick(tx)}
                className="flex items-center justify-between p-4 rounded-lg bg-[#0A0F1C] border border-[#1F2937] hover:border-[#374151] hover:bg-[#1F2937] cursor-pointer transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#E5E7EB]">
                      {tx.fromChain.name} → {tx.toChain.name}
                    </span>
                    <StatusIcon className={`h-4 w-4 ${color}`} />
                  </div>
                  <div className="text-sm text-[#9CA3AF]">
                    {formatAmount(tx.amount, tx.token.decimals)} {tx.token.symbol}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[#9CA3AF]">
                    {formatDate(tx.timestamp)}
                  </div>
                  <div className="text-xs text-[#6B7280]">
                    {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-[#9CA3AF]">
            No transactions found
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-[#1F2937] text-[#E5E7EB] hover:bg-[#1F2937] disabled:opacity-50"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-[#1F2937] text-[#E5E7EB] hover:bg-[#1F2937] disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}