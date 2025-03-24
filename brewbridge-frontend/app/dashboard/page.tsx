import { formatAmount } from '@/lib/utils';
import Image from 'next/image';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0F1116] text-white pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Portfolio Summary */}
        <div className="bg-[#1A1B23] rounded-2xl p-8">
          <h2 className="text-lg text-gray-400 mb-4">Portfolio Summary</h2>
          <div className="space-y-2">
            <h3 className="text-4xl font-semibold">Cross-chain Balance</h3>
            <p className="text-5xl font-bold">${formatAmount(1250.00)}</p>
          </div>
        </div>

        {/* Recent Transfers */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Recent Transfers</h2>
          <div className="bg-[#1A1B23] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="p-4">Date</th>
                  <th className="p-4">Asset</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/10">
                  <td className="p-4">2024-04-24</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Image src="/ethereum.svg" alt="Ethereum" width={20} height={20} />
                      <span>Ethereum → Arbitrum</span>
                    </div>
                  </td>
                  <td className="p-4">0.5 ETH</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-4">2024-04-24</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Image src="/avalanche.svg" alt="Avalanche" width={20} height={20} />
                      <span>Avalanche → Arbitrum</span>
                    </div>
                  </td>
                  <td className="p-4">1,500 USDC</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500">
                      Confirmed
                    </span>
                  </td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-4">2024-04-24</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Image src="/ethereum.svg" alt="Ethereum" width={20} height={20} />
                      <span>Ethereum → Arbitrum</span>
                    </div>
                  </td>
                  <td className="p-4">100 DAI</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500">
                      Confirmed
                    </span>
                  </td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-4">2024-04-24</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Image src="/ethereum.svg" alt="Ethereum" width={20} height={20} />
                      <span>Ethereum → Arbitrum</span>
                    </div>
                  </td>
                  <td className="p-4">5.50 USDC</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500">
                      Confirmed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}