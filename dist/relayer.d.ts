export declare class BridgeRelayer {
    private hubProvider;
    private destProviders;
    private relayerWallet;
    private hubContract;
    constructor();
    start(): Promise<void>;
    private relayToDestination;
    private getGatewayAddress;
}
