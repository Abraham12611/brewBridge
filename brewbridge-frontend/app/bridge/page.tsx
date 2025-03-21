'use client';

import { useState } from 'react';
import { ChainSelector } from '@/components/ChainSelector';
import { Chain, SUPPORTED_CHAINS, TOKENS } from '@/lib/constants';
import { formatAmount } from '@/lib/utils';
import { useWallet } from '@/lib/hooks/useWallet';
import { usePrivy } from '@privy-io/react-auth';
import { Toaster, toast } from 'sonner';
import { ethers } from 'ethers';
import { useTransactionStatus } from '@/lib/hooks/useTransactionStatus';
import { useGasEstimate } from '@/lib/hooks/useGasEstimate';
import { useWalletClient } from 'wagmi';
import ChainTokenSelect from '@/components/ChainTokenSelect';
import TransactionStatus from '@/components/TransactionStatus';
import LoadingSpinner from '@/components/LoadingSpinner';
import { SlippageSettings } from '@/components/SlippageSettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Fuel, Timer } from 'lucide-react';

// Bridge contract ABI
const BRIDGE_ABI = [
  'function deposit(address token, uint256 amount, uint256 destChainId, address recipient) payable',
  'function approve(address spender, uint256 amount) returns (bool)',
];

export default function BridgePage() {
  const { ready, authenticated, user, login } = usePrivy();
  const { data: walletClient } = useWalletClient();
  const { isConnected, currentChainId, getBalance, switchNetwork, isLoading, address, activeWallet } = useWallet();
  const [sourceChain, setSourceChain] = useState<Chain>(SUPPORTED_CHAINS[0]);
  const [destChain, setDestChain] = useState<Chain>(SUPPORTED_CHAINS[1]);
  const [amount, setAmount] = useState<string>('');
  const [isBridging, setIsBridging] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState(TOKENS[SUPPORTED_CHAINS[0].id][0]);
  const [slippage, setSlippage] = useState(0.5);
  const [error, setError] = useState<string | null>(null);

  const { status: txStatus } = useTransactionStatus(
    sourceChain.id,
    destChain.id,
    txHash
  );

  const { estimate: gasEstimate, error: gasError, isLoading: isGasLoading } = useGasEstimate({
    sourceChain,
    destChain,
    amount,
    token: selectedToken,
  });

  // Get USDC balance for the selected source chain
  const userBalance = getBalance(sourceChain.id, 'USDC');

  // Handle source chain change
  const handleSourceChainChange = async (chain: Chain) => {
    try {
      setError(null);
      setSourceChain(chain);
      if (isConnected && currentChainId !== chain.id) {
        await switchNetwork(chain.id);
        toast.success(`Switched to ${chain.name}`);
      }
      setSelectedToken(TOKENS[chain.id][0]);
    } catch (error) {
      console.error('Failed to switch network:', error);
      setError('Failed to switch network. Please try again.');
      toast.error('Failed to switch network. Please try again.');
    }
  };

  // Validate if user can bridge
  const canBridge = () => {
    if (!isConnected) return false;
    if (isLoading || isBridging) return false;
    if (!amount || parseFloat(amount) <= 0) return false;
    if (parseFloat(amount) > parseFloat(userBalance)) return false;
    if (error) return false;
    return true;
  };

  // Get the button text based on state
  const getButtonText = () => {
    if (!user) return 'Connect Wallet';
    if (isLoading) return 'Loading...';
    if (isBridging) return 'Bridging...';
    return 'Bridge Now';
  };

  // Handle bridge action
  const handleBridge = async () => {
    if (!user || !walletClient || !amount) return;

    try {
      setError(null);
      setIsBridging(true);

      // Create contract instance
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const bridgeContract = new ethers.Contract(sourceChain.bridgeAddress, BRIDGE_ABI, signer);

      // Convert amount to wei
      const amountWei = ethers.parseUnits(amount, selectedToken.decimals);

      // Approve token spending
      const tokenContract = new ethers.Contract(selectedToken.address, ['function approve(address spender, uint256 amount)'], signer);
      const approveTx = await tokenContract.approve(sourceChain.bridgeAddress, amountWei);
      await approveTx.wait();

      toast.success('Token approval confirmed');

      // Initiate bridge transfer
      const tx = await bridgeContract.deposit(
        selectedToken.address,
        amountWei,
        destChain.id,
        await signer.getAddress()
      );

      setTxHash(tx.hash);
      toast.success('Bridge transfer initiated');

      await tx.wait();
      toast.success('Transfer confirmed on source chain');

    } catch (error) {
      console.error('Bridge error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to bridge tokens';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsBridging(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-[#0A0F1C]">
      <div className="max-w-xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#E5E7EB] bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Bridge
          </h1>
          <p className="text-[#9CA3AF]">
            Transfer tokens between supported chains
          </p>
        </div>

        <Card className="bg-[#111827] border-[#1F2937]">
          <CardContent className="space-y-6 pt-6">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertTitle className="text-red-500">Error</AlertTitle>
                <AlertDescription className="text-red-500">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <ChainTokenSelect
                label="From"
                selectedChain={sourceChain}
                availableChains={SUPPORTED_CHAINS}
                selectedToken={selectedToken}
                availableTokens={TOKENS[sourceChain.id]}
                onChainChange={handleSourceChainChange}
                onTokenChange={setSelectedToken}
                disabled={!authenticated || isLoading || isBridging}
                userAddress={user?.wallet?.address}
              />

              <ChainTokenSelect
                label="To"
                selectedChain={destChain}
                availableChains={SUPPORTED_CHAINS.filter(c => c.id !== sourceChain.id)}
                selectedToken={selectedToken}
                availableTokens={TOKENS[destChain.id]}
                onChainChange={setDestChain}
                onTokenChange={setSelectedToken}
                disabled={!authenticated || isLoading || isBridging}
                userAddress={user?.wallet?.address}
              />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-[#E5E7EB]">Amount</label>
                  <span className="text-sm text-[#9CA3AF]">
                    {isLoading ? (
                      'Loading...'
                    ) : (
                      `Available: ${formatAmount(userBalance)} USDC`
                    )}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        setAmount(value);
                      }
                    }}
                    className={`
                      w-full px-4 py-3 rounded-lg
                      bg-[#1F2937] text-[#E5E7EB]
                      border border-[#374151]
                      focus:outline-none focus:border-[#4B5563]
                      ${isBridging ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    placeholder="0.00"
                    disabled={isBridging}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <span className="text-[#9CA3AF]">USDC</span>
                  </div>
                </div>
              </div>

              <SlippageSettings
                value={slippage}
                onChange={setSlippage}
                disabled={isBridging}
              />

              <div className="space-y-2">
                <div className="text-sm text-[#9CA3AF]">
                  Route: {sourceChain.name} → BrewBridge Hub → {destChain.name}
                </div>
                <div className="flex justify-between text-sm text-[#9CA3AF]">
                  <div className="flex items-center space-x-2">
                    <Timer className="h-4 w-4" />
                    <span>Estimated ~90 seconds</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Fuel className="h-4 w-4" />
                    <span>
                      {isGasLoading ? (
                        'Loading...'
                      ) : gasError ? (
                        'Error'
                      ) : gasEstimate ? (
                        `${gasEstimate.totalCost} ETH`
                      ) : (
                        '0 ETH'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={user ? handleBridge : () => login()}
                disabled={user && !canBridge()}
                className={`
                  w-full py-4 rounded-lg transition-all duration-200
                  ${user && canBridge()
                    ? 'bg-gradient-to-r from-[#00C2FF] to-[#7B00FF] text-white hover:opacity-90'
                    : 'bg-[#1F2937] text-[#6B7280] cursor-not-allowed'
                  }
                `}
              >
                {getButtonText()}
              </button>
            </div>

            {txHash && (
              <TransactionStatus
                txHash={txHash}
                status={txStatus}
                sourceChain={sourceChain}
                destChain={destChain}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}