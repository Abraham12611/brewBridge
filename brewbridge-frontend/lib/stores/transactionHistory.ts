import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chain } from '@/lib/constants';

export interface Transaction {
  id: string;
  fromChain: Chain;
  toChain: Chain;
  amount: string;
  token: {
    symbol: string;
    decimals: number;
    address: string;
  };
  status: 'pending' | 'confirmed' | 'completed' | 'failed';
  timestamp: number;
  txHash: string;
  sourceTxHash?: string;
  destTxHash?: string;
  error?: string;
  userAddress: string;
}

interface TransactionHistoryState {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (txHash: string, updates: Partial<Transaction>) => void;
  removeTransaction: (txHash: string) => void;
  getTransactionsByStatus: (status: Transaction['status']) => Transaction[];
  getTransactionsByChain: (chainId: number) => Transaction[];
  getTransactionsByUser: (userAddress: string) => Transaction[];
  clearHistory: () => void;
}

export const useTransactionHistory = create<TransactionHistoryState>()(
  persist(
    (set, get) => ({
      transactions: [],
      addTransaction: (tx) =>
        set((state) => ({
          transactions: [tx, ...state.transactions],
        })),
      updateTransaction: (txHash, updates) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.txHash === txHash ? { ...tx, ...updates } : tx
          ),
        })),
      removeTransaction: (txHash) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.txHash !== txHash),
        })),
      getTransactionsByStatus: (status) =>
        get().transactions.filter((tx) => tx.status === status),
      getTransactionsByChain: (chainId) =>
        get().transactions.filter(
          (tx) => tx.fromChain.id === chainId || tx.toChain.id === chainId
        ),
      getTransactionsByUser: (userAddress) =>
        get().transactions.filter((tx) => tx.userAddress === userAddress),
      clearHistory: () => set({ transactions: [] }),
    }),
    {
      name: 'transaction-history',
      skipHydration: true,
    }
  )
);