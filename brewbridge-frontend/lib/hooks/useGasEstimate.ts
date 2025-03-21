import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Chain } from '@/lib/constants';

interface GasEstimate {
  gasPrice: string;
  gasLimit: string;
  totalCost: string;
}

interface UseGasEstimateProps {
  sourceChain: Chain | null;
  destChain: Chain | null;
  amount: string;
  token: {
    address: string;
    decimals: number;
  };
}

export function useGasEstimate({
  sourceChain,
  destChain,
  amount,
  token,
}: UseGasEstimateProps) {
  const [estimate, setEstimate] = useState<GasEstimate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchGasEstimate() {
      if (!sourceChain || !destChain || !amount || !token) {
        setEstimate(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Create provider
        const provider = new ethers.JsonRpcProvider(sourceChain.rpcUrl);

        // Get current gas price
        const gasPrice = await provider.getFeeData();
        const currentGasPrice = gasPrice.gasPrice || ethers.parseUnits('50', 'gwei');

        // Estimate gas limit for token approval
        const tokenContract = new ethers.Contract(
          token.address,
          ['function approve(address spender, uint256 amount)'],
          provider
        );
        const amountWei = ethers.parseUnits(amount, token.decimals);
        const approveGasLimit = await tokenContract.approve.estimateGas(
          sourceChain.bridgeAddress,
          amountWei
        );

        // Estimate gas limit for bridge deposit
        const bridgeContract = new ethers.Contract(
          sourceChain.bridgeAddress,
          ['function deposit(address token, uint256 amount, uint256 destChainId, address recipient)'],
          provider
        );
        const depositGasLimit = await bridgeContract.deposit.estimateGas(
          token.address,
          amountWei,
          destChain.id,
          await provider.getSigner().getAddress()
        );

        // Calculate total gas limit with buffer
        const totalGasLimit = approveGasLimit + depositGasLimit + ethers.parseUnits('50000', 'wei');

        // Calculate total cost
        const totalCost = totalGasLimit * currentGasPrice;

        setEstimate({
          gasPrice: ethers.formatUnits(currentGasPrice, 'gwei'),
          gasLimit: ethers.formatUnits(totalGasLimit, 'wei'),
          totalCost: ethers.formatEther(totalCost),
        });
      } catch (err) {
        console.error('Gas estimation error:', err);
        setError(err instanceof Error ? err.message : 'Failed to estimate gas');
      } finally {
        setIsLoading(false);
      }
    }

    fetchGasEstimate();
  }, [sourceChain, destChain, amount, token]);

  return { estimate, error, isLoading };
}