import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Hero Section */}
      <div className="w-full min-h-screen bg-[#0a0b0f] flex items-center justify-between px-6 md:px-24 py-24">
        {/* Left side - Text content */}
        <div className="flex-1 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            One Hub. Every Chain. Seamless Liquidity.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-12">
            Transfer assets across multiple blockchains smoothly and securely. AI-optimized routing,
            rapid Espresso confirmations, and broad chain support.
          </p>
          <div className="flex gap-4">
            <Link
              href="/bridge"
              className="px-8 py-4 bg-gradient-to-r from-[#00C2FF] to-[#7B00FF] rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Launch App
            </Link>
          </div>

          {/* Chain Icons */}
          <div className="flex items-center gap-8 mt-16">
            <Image src="/ethereum.svg" alt="Ethereum" width={40} height={40} />
            <Image src="/arbitrum.svg" alt="Arbitrum" width={40} height={40} />
            <Image src="/solana.svg" alt="Solana" width={40} height={40} />
            <Image src="/polygon.svg" alt="Polygon" width={40} height={40} />
            <Image src="/cosmos.svg" alt="Cosmos" width={40} height={40} />
          </div>
        </div>

        {/* Right side - Bridge Interface Preview */}
        <div className="hidden lg:block flex-1 ml-24">
          <div className="bg-[#0F1116] p-8 rounded-2xl shadow-2xl max-w-md">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-6 h-6 rounded-full bg-blue-500"></div>
              <h2 className="text-xl font-semibold">BrewBridge</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">From</label>
                <button className="w-full flex items-center justify-between bg-[#1A1B23] p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Image src="/ethereum.svg" alt="Ethereum" width={24} height={24} />
                    <span>Ethereum</span>
                  </div>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">To</label>
                <button className="w-full flex items-center justify-between bg-[#1A1B23] p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Image src="/polygon.svg" alt="Polygon" width={24} height={24} />
                    <span>Polygon</span>
                  </div>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0"
                    className="w-full bg-[#1A1B23] p-4 rounded-lg text-right pr-24"
                    value="0 USDC"
                    readOnly
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    Balance: 0
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-400">
                Route: Ethereum → BrewBridge → Polygon
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-[#00C2FF] to-[#7B00FF] rounded-lg font-semibold">
                Bridge Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
