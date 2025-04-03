"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BridgeRelayer = void 0;
const ethers_1 = require("ethers");
const dotenv_1 = require("dotenv");
const winston_1 = require("winston");
(0, dotenv_1.config)();
// Setup winston logger
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple())
        })
    ]
});
// ABI snippet for the Hub contract's Withdraw event
const HUB_ABI = [
    "event Withdraw(address indexed token, address indexed to, uint256 amount, uint256 indexed destChainId)"
];
class BridgeRelayer {
    constructor() {
        // Initialize providers
        this.hubProvider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.ROLLUP_RPC_URL);
        this.destProviders = new Map([
            [11155111, new ethers_1.ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL)],
            [80001, new ethers_1.ethers.providers.JsonRpcProvider(process.env.POLYGON_MUMBAI_RPC_URL)] // Mumbai
        ]);
        // Initialize relayer wallet
        this.relayerWallet = new ethers_1.ethers.Wallet(process.env.RELAYER_PRIVATE_KEY, this.hubProvider);
        // Initialize hub contract
        this.hubContract = new ethers_1.ethers.Contract(process.env.BREWBRIDGE_HUB_ADDRESS, HUB_ABI, this.hubProvider);
    }
    async start() {
        logger.info('Starting BrewBridge relayer service...');
        // Listen for Withdraw events on the hub
        this.hubContract.on('Withdraw', async (token, to, amount, destChainId, event) => {
            logger.info(`Detected Withdraw event: ${JSON.stringify({
                token, to, amount: amount.toString(), destChainId: destChainId.toString()
            })}`);
            try {
                await this.relayToDestination(token, to, amount, destChainId, event.transactionHash);
            }
            catch (error) {
                logger.error(`Failed to relay transaction: ${error}`);
            }
        });
        logger.info('Relayer is listening for events...');
    }
    async relayToDestination(token, recipient, amount, destChainId, sourceTxHash) {
        const destProvider = this.destProviders.get(destChainId);
        if (!destProvider) {
            throw new Error(`Unsupported destination chain: ${destChainId}`);
        }
        // Get the appropriate gateway address for this chain
        const gatewayAddress = this.getGatewayAddress(destChainId);
        // Create a wallet for this destination
        const destWallet = new ethers_1.ethers.Wallet(process.env.RELAYER_PRIVATE_KEY, destProvider);
        // Get gateway contract interface
        const gatewayContract = new ethers_1.ethers.Contract(gatewayAddress, ["function releaseTokens(address token, address to, uint256 amount, bytes32 sourceTxHash)"], destWallet);
        logger.info(`Relaying to chain ${destChainId}...`);
        // Submit the release transaction
        const tx = await gatewayContract.releaseTokens(token, recipient, amount, sourceTxHash, { gasLimit: 500000 } // Adjust as needed
        );
        logger.info(`Submitted relay transaction: ${tx.hash}`);
        // Wait for confirmation
        const receipt = await tx.wait();
        logger.info(`Relay confirmed in block ${receipt.blockNumber}`);
    }
    getGatewayAddress(chainId) {
        switch (chainId) {
            case 11155111: // Sepolia
                return process.env.SEPOLIA_GATEWAY_ADDRESS;
            case 80001: // Mumbai
                return process.env.MUMBAI_GATEWAY_ADDRESS;
            default:
                throw new Error(`No gateway address for chain ${chainId}`);
        }
    }
}
exports.BridgeRelayer = BridgeRelayer;
//# sourceMappingURL=relayer.js.map