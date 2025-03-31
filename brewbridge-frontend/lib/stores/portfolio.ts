import { create } from 'zustand';
import { Chain } from '@/lib/constants';

interface TokenBalance {
  symbol: string;
  address: string;
  balance: string;
  decimals: number;
  usdValue: number;
  chain: Chain;
}

interface ChainPortfolio {
  chain: Chain;
  totalUsdValue: number;
  tokens: TokenBalance[];
}

interface PortfolioState {
  portfolios: ChainPortfolio[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  // Actions
  setPortfolio: (chainId: number, portfolio: ChainPortfolio) => void;
  updateTokenBalance: (chainId: number, tokenAddress: string, balance: string, usdValue: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  // Getters
  getTotalPortfolioValue: () => number;
  getChainPortfolio: (chainId: number) => ChainPortfolio | undefined;
  getTokenBalance: (chainId: number, tokenAddress: string) => TokenBalance | undefined;
}

export const usePortfolio = create<PortfolioState>()((set, get) => ({
  portfolios: [],
  isLoading: false,
  error: null,
  lastUpdated: null,

  setPortfolio: (chainId, portfolio) =>
    set((state) => ({
      portfolios: [
        ...state.portfolios.filter((p) => p.chain.id !== chainId),
        portfolio,
      ],
      lastUpdated: Date.now(),
    })),

  updateTokenBalance: (chainId, tokenAddress, balance, usdValue) =>
    set((state) => ({
      portfolios: state.portfolios.map((p) =>
        p.chain.id === chainId
          ? {
              ...p,
              tokens: p.tokens.map((t) =>
                t.address === tokenAddress
                  ? { ...t, balance, usdValue }
                  : t
              ),
              totalUsdValue: p.tokens.reduce(
                (acc, t) =>
                  t.address === tokenAddress
                    ? acc + usdValue
                    : acc + t.usdValue,
                0
              ),
            }
          : p
      ),
      lastUpdated: Date.now(),
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  getTotalPortfolioValue: () =>
    get().portfolios.reduce((acc, p) => acc + p.totalUsdValue, 0),

  getChainPortfolio: (chainId) =>
    get().portfolios.find((p) => p.chain.id === chainId),

  getTokenBalance: (chainId, tokenAddress) =>
    get()
      .portfolios.find((p) => p.chain.id === chainId)
      ?.tokens.find((t) => t.address === tokenAddress),
}));