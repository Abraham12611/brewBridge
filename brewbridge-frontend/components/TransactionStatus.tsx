import { Chain } from '@/lib/constants';

interface TransactionStatusProps {
  txHash: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'failed';
  sourceChain: Chain;
  destChain: Chain;
}

export default function TransactionStatus({
  txHash,
  status,
  sourceChain,
  destChain,
}: TransactionStatusProps) {
  if (!txHash) return null;

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-400';
      case 'failed':
        return 'bg-red-500/10 text-red-400';
      default:
        return 'bg-blue-500/10 text-blue-400';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'pending':
        return `Transaction pending on ${sourceChain.name}...`;
      case 'confirmed':
        return `Transaction confirmed on ${sourceChain.name}, waiting for BrewBridge...`;
      case 'completed':
        return `Bridge transfer complete! Assets arrived on ${destChain.name}`;
      case 'failed':
        return 'Bridge transfer failed';
      default:
        return 'Unknown status';
    }
  };

  const getExplorerLink = () => {
    const chain = status === 'completed' ? destChain : sourceChain;
    const baseUrl = chain.explorerUrl || '';
    return `${baseUrl}/tx/${txHash}`;
  };

  return (
    <div className={`p-4 rounded-lg ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm">{getStatusMessage()}</p>
        {txHash && (
          <a
            href={getExplorerLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline ml-2"
          >
            View on Explorer
          </a>
        )}
      </div>

      {/* Progress Steps */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex-1">
          <div className={`h-2 rounded ${status !== 'pending' ? 'bg-blue-400' : 'bg-gray-300'}`} />
          <p className="text-xs mt-1">Source Chain</p>
        </div>
        <div className="flex-1 mx-2">
          <div className={`h-2 rounded ${status === 'confirmed' ? 'bg-blue-400' : status === 'completed' ? 'bg-green-400' : 'bg-gray-300'}`} />
          <p className="text-xs mt-1">BrewBridge</p>
        </div>
        <div className="flex-1">
          <div className={`h-2 rounded ${status === 'completed' ? 'bg-green-400' : 'bg-gray-300'}`} />
          <p className="text-xs mt-1">Destination Chain</p>
        </div>
      </div>
    </div>
  );
}