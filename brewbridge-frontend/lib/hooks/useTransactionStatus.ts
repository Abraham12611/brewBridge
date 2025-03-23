import { useState, useEffect } from 'react';
import { Chain } from '@/lib/constants';
import { ethers } from 'ethers';

type TransactionStatus = {
  status: 'pending' | 'confirmed' | 'completed' | 'failed';
  error?: string;
};

export function useTransactionStatus(
  sourceChain: Chain | null,
  destChain: Chain | null,
  txHash?: string
): TransactionStatus {
  const [status, setStatus] = useState<TransactionStatus>({ status: 'pending' });

  useEffect(() => {
    if (!txHash || !sourceChain || !destChain) {
      setStatus({ status: 'pending' });
      return;
    }

    let mounted = true;
    let interval: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        // Check source chain transaction
        const sourceProvider = new ethers.providers.JsonRpcProvider(sourceChain.rpcUrl);
        const receipt = await sourceProvider.getTransactionReceipt(txHash);

        if (!receipt) {
          if (mounted) setStatus({ status: 'pending' });
          return;
        }

        if (receipt.status === 0) {
          if (mounted) setStatus({ status: 'failed', error: 'Transaction reverted on source chain' });
          return;
        }

        // Transaction is confirmed on source chain
        if (mounted) setStatus({ status: 'confirmed' });

        // TODO: Check destination chain for completion
        // This will involve checking the BrewBridge contract on the destination chain
        // for an event indicating the transfer is complete
        // For now, we'll simulate completion after a delay
        setTimeout(() => {
          if (mounted) setStatus({ status: 'completed' });
        }, 5000);
      } catch (error) {
        console.error('Error checking transaction status:', error);
        if (mounted) setStatus({ status: 'failed', error: 'Failed to check transaction status' });
      }
    };

    // Start polling
    interval = setInterval(checkStatus, 3000);
    checkStatus();

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [txHash, sourceChain, destChain]);

  return status;
}