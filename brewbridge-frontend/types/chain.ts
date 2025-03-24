export interface Chain {
  id: number;
  name: string;
  symbol: string;
  icon?: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}