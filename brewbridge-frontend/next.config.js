/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ['@privy-io/react-auth', 'wagmi', 'viem', '@solana/web3.js'],
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				net: false,
				tls: false,
				crypto: false,
				stream: false,
				http: false,
				https: false,
				zlib: false,
				path: false,
				os: false,
			};
		}
		return config;
	}
}

module.exports = nextConfig