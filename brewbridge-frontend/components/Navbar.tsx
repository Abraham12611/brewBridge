import { useWallets } from '@privy-io/react-auth';
import Link from 'next/link';
import { truncateAddress } from '@/lib/utils';

export function Navbar() {
  const { wallets, linkWallets } = useWallets();
  const isConnected = wallets.length > 0;
  const connectedWallet = wallets[0];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F1116]/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00C2FF] to-[#7B00FF]"></div>
              <span className="text-xl font-semibold">BrewBridge</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>

            {isConnected ? (
              <button
                className="px-4 py-2 rounded-lg bg-[#1A1B23] text-white hover:bg-[#2A2B33] transition-colors"
              >
                {truncateAddress(connectedWallet.address)}
              </button>
            ) : (
              <button
                onClick={linkWallets}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00C2FF] to-[#7B00FF] text-white hover:opacity-90 transition-opacity"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}