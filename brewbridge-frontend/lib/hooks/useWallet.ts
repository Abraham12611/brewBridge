import { useState, useEffect } from 'react';
import { useWallets, usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { Chain, Token, TOKENS, SUPPORTED_CHAINS } from '@/lib/constants';

// ERC20 ABI for balance checking
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
];

export function useWallet() {
  const { wallets } = useWallets();
  const { ready, authenticated } = usePrivy();
  const [balances, setBalances] = useState<{ [key: string]: string }>({});
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeWallet = wallets[0]; // Using first wallet as active

  // Function to fetch token balance for a specific chain and token
  const fetchTokenBalance = async (chain: Chain, token: Token) => {
    if (!activeWallet?.address) return '0';

    try {
      const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrl);
      const tokenContract = new ethers.Contract(token.address, ERC20_ABI, provider);
      const balance = await tokenContract.balanceOf(activeWallet.address);
      return ethers.utils.formatUnits(balance, token.decimals);
    } catch (error) {
      console.error(`Error fetching balance for ${token.symbol} on ${chain.name}:`, error);
      return '0';
    }
  };

  // Function to update balances for all supported chains
  const updateBalances = async () => {
    if (!activeWallet?.address || !ready || !authenticated) return;

    setIsLoading(true);
    const newBalances: { [key: string]: string } = {};

    try {
      for (const chainConfig of SUPPORTED_CHAINS) {
        const tokens = TOKENS[chainConfig.id] || [];
        for (const token of tokens) {
          const balance = await fetchTokenBalance(chainConfig, token);
          newBalances[`${chainConfig.id}-${token.symbol}`] = balance;
        }
      }
      setBalances(newBalances);
    } catch (error) {
      console.error('Error updating balances:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to switch network
  const switchNetwork = async (chainId: number) => {
    if (!activeWallet) return;

    try {
      const provider = await activeWallet.getEthereumProvider();
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      setCurrentChainId(chainId);
    } catch (error) {
      console.error('Error switching network:', error);
      throw error;
    }
  };

  // Get balance for specific chain and token
  const getBalance = (chainId: number, symbol: string) => {
    return balances[`${chainId}-${symbol}`] || '0';
  };

  // Update balances when wallet changes
  useEffect(() => {
    if (ready && authenticated && activeWallet) {
      updateBalances();

      // Set initial chain ID
      activeWallet.getEthereumProvider().then(async (provider) => {
        const chainId = await provider.request({ method: 'eth_chainId' });
        setCurrentChainId(parseInt(chainId, 16));
      });

      // Listen for network changes
      const handleChainChanged = (chainId: any) => {
        // chainId comes as hex string from the provider
        if (typeof chainId === 'string') {
          setCurrentChainId(parseInt(chainId, 16));
        }
      };

      // Add event listener
      activeWallet.getEthereumProvider().then((provider) => {
        provider.on('chainChanged', handleChainChanged as any);
      });

      return () => {
        // Remove event listener
        activeWallet.getEthereumProvider().then((provider) => {
          provider.removeListener('chainChanged', handleChainChanged as any);
        });
      };
    }
  }, [ready, authenticated, activeWallet?.address]);

  return {
    isConnected: ready && authenticated && !!activeWallet,
    address: activeWallet?.address,
    currentChainId,
    isLoading,
    getBalance,
    switchNetwork,
    updateBalances,
    activeWallet, // Expose the active wallet
  };
}