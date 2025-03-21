import { Chain, Token } from '@/lib/constants';
import TokenIcon from './TokenIcon';
import TokenBalance from './TokenBalance';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Search, X } from 'lucide-react';

interface ChainTokenSelectProps {
  label: string;
  selectedChain: Chain;
  availableChains: Chain[];
  selectedToken: Token;
  availableTokens: Token[];
  onChainChange: (chain: Chain) => void;
  onTokenChange: (token: Token) => void;
  disabled?: boolean;
  userAddress?: string;
}

export default function ChainTokenSelect({
  label,
  selectedChain,
  availableChains,
  selectedToken,
  availableTokens,
  onChainChange,
  onTokenChange,
  disabled = false,
  userAddress,
}: ChainTokenSelectProps) {
  const [isChainModalOpen, setIsChainModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChains = availableChains.filter(chain =>
    chain.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTokens = availableTokens.filter(token =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#E5E7EB]">{label}</label>

      <div className="flex gap-2">
        {/* Chain Selection Button */}
        <button
          onClick={() => !disabled && setIsChainModalOpen(true)}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            ${disabled ? 'bg-[#1F2937] cursor-not-allowed' : 'bg-[#1F2937] hover:bg-[#374151]'}
            border border-[#374151] flex-1
          `}
        >
          <TokenIcon src={selectedChain.icon} alt={selectedChain.name} size={24} />
          <span className="text-[#E5E7EB]">{selectedChain.name}</span>
        </button>

        {/* Token Selection Button */}
        <button
          onClick={() => !disabled && setIsTokenModalOpen(true)}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            ${disabled ? 'bg-[#1F2937] cursor-not-allowed' : 'bg-[#1F2937] hover:bg-[#374151]'}
            border border-[#374151] flex-1
          `}
        >
          <TokenIcon src={selectedToken.icon} alt={selectedToken.symbol} size={24} />
          <span className="text-[#E5E7EB]">{selectedToken.symbol}</span>
        </button>
      </div>

      {/* Chain Selection Modal */}
      <Dialog
        open={isChainModalOpen}
        onClose={() => setIsChainModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/80" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-[#111827] border border-[#374151] p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-medium text-[#E5E7EB]">
                Select a chain
              </Dialog.Title>
              <button
                onClick={() => setIsChainModalOpen(false)}
                className="text-[#6B7280] hover:text-[#E5E7EB]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
              <input
                type="text"
                placeholder="Search chains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1F2937] border border-[#374151] rounded-lg text-[#E5E7EB] placeholder-[#6B7280]"
              />
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredChains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => {
                    onChainChange(chain);
                    setIsChainModalOpen(false);
                    setSearchQuery('');
                  }}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg
                    ${selectedChain.id === chain.id ? 'bg-[#3B82F6]/10 border-[#3B82F6]' : 'hover:bg-[#1F2937]'}
                    border border-transparent hover:border-[#374151]
                  `}
                >
                  <TokenIcon src={chain.icon} alt={chain.name} size={32} />
                  <div className="flex flex-col items-start">
                    <span className="text-[#E5E7EB] font-medium">{chain.name}</span>
                    <span className="text-sm text-[#6B7280]">{chain.nativeCurrency.symbol}</span>
                  </div>
                </button>
              ))}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Token Selection Modal */}
      <Dialog
        open={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/80" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-[#111827] border border-[#374151] p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-medium text-[#E5E7EB]">
                Select a token
              </Dialog.Title>
              <button
                onClick={() => setIsTokenModalOpen(false)}
                className="text-[#6B7280] hover:text-[#E5E7EB]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1F2937] border border-[#374151] rounded-lg text-[#E5E7EB] placeholder-[#6B7280]"
              />
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredTokens.map((token) => (
                <button
                  key={token.address}
                  onClick={() => {
                    onTokenChange(token);
                    setIsTokenModalOpen(false);
                    setSearchQuery('');
                  }}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg
                    ${selectedToken.address === token.address ? 'bg-[#3B82F6]/10 border-[#3B82F6]' : 'hover:bg-[#1F2937]'}
                    border border-transparent hover:border-[#374151]
                  `}
                >
                  <TokenIcon src={token.icon} alt={token.symbol} size={32} />
                  <div className="flex flex-col items-start">
                    <span className="text-[#E5E7EB] font-medium">{token.name}</span>
                    <span className="text-sm text-[#6B7280]">{token.symbol}</span>
                  </div>
                  {userAddress && (
                    <div className="ml-auto">
                      <TokenBalance
                        chain={selectedChain}
                        token={token}
                        userAddress={userAddress}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Token Balance */}
      {userAddress && (
        <div className="mt-1 text-sm text-[#9CA3AF]">
          Balance: <TokenBalance
            chain={selectedChain}
            token={selectedToken}
            userAddress={userAddress}
          />
        </div>
      )}
    </div>
  );
}