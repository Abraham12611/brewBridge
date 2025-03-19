import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Theme {
  mode: 'light' | 'dark';
  accent: string;
}

interface UserPreferences {
  theme: Theme;
  slippageTolerance: number;
  gasPreference: 'standard' | 'fast' | 'instant';
  favoriteTokens: string[];
  favoriteChains: number[];
  notifications: {
    transactions: boolean;
    priceAlerts: boolean;
    networkStatus: boolean;
  };
  setTheme: (theme: Theme) => void;
  setSlippageTolerance: (tolerance: number) => void;
  setGasPreference: (preference: 'standard' | 'fast' | 'instant') => void;
  addFavoriteToken: (tokenAddress: string) => void;
  removeFavoriteToken: (tokenAddress: string) => void;
  addFavoriteChain: (chainId: number) => void;
  removeFavoriteChain: (chainId: number) => void;
  updateNotificationSettings: (settings: Partial<UserPreferences['notifications']>) => void;
}

export const useUserPreferences = create<UserPreferences>()(
  persist(
    (set) => ({
      theme: {
        mode: 'dark',
        accent: '#00C2FF',
      },
      slippageTolerance: 0.5,
      gasPreference: 'standard',
      favoriteTokens: [],
      favoriteChains: [],
      notifications: {
        transactions: true,
        priceAlerts: true,
        networkStatus: true,
      },
      setTheme: (theme) => set({ theme }),
      setSlippageTolerance: (tolerance) => set({ slippageTolerance: tolerance }),
      setGasPreference: (preference) => set({ gasPreference: preference }),
      addFavoriteToken: (tokenAddress) =>
        set((state) => ({
          favoriteTokens: [...new Set([...state.favoriteTokens, tokenAddress])],
        })),
      removeFavoriteToken: (tokenAddress) =>
        set((state) => ({
          favoriteTokens: state.favoriteTokens.filter((t) => t !== tokenAddress),
        })),
      addFavoriteChain: (chainId) =>
        set((state) => ({
          favoriteChains: [...new Set([...state.favoriteChains, chainId])],
        })),
      removeFavoriteChain: (chainId) =>
        set((state) => ({
          favoriteChains: state.favoriteChains.filter((c) => c !== chainId),
        })),
      updateNotificationSettings: (settings) =>
        set((state) => ({
          notifications: { ...state.notifications, ...settings },
        })),
    }),
    {
      name: 'user-preferences',
      skipHydration: true,
    }
  )
);