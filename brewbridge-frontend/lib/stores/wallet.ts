import { create } from 'zustand';
import { Chain } from '@/lib/constants';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  currentChain: Chain | null;
  isConnecting: boolean;
  error: string | null;
  pendingTransactions: string[];
  // Actions
  setConnected: (connected: boolean) => void;
  setAddress: (address: string | null) => void;
  setCurrentChain: (chain: Chain | null) => void;
  setConnecting: (connecting: boolean) => void;
  setError: (error: string | null) => void;
  addPendingTransaction: (txHash: string) => void;
  removePendingTransaction: (txHash: string) => void;
  // Getters
  hasPendingTransactions: () => boolean;
  getPendingTransactionsCount: () => number;
  // Reset
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>()((set, get) => ({
  isConnected: false,
  address: null,
  currentChain: null,
  isConnecting: false,
  error: null,
  pendingTransactions: [],

  setConnected: (connected) => set({ isConnected: connected }),
  setAddress: (address) => set({ address }),
  setCurrentChain: (chain) => set({ currentChain: chain }),
  setConnecting: (connecting) => set({ isConnecting: connecting }),
  setError: (error) => set({ error }),

  addPendingTransaction: (txHash) =>
    set((state) => ({
      pendingTransactions: [...state.pendingTransactions, txHash],
    })),

  removePendingTransaction: (txHash) =>
    set((state) => ({
      pendingTransactions: state.pendingTransactions.filter((hash) => hash !== txHash),
    })),

  hasPendingTransactions: () => get().pendingTransactions.length > 0,
  getPendingTransactionsCount: () => get().pendingTransactions.length,

  disconnect: () =>
    set({
      isConnected: false,
      address: null,
      currentChain: null,
      error: null,
      pendingTransactions: [],
    }),
}));