export interface OKXResponse<T> {
  code: string;
  msg: string;
  data: T;
}

export interface TokenPriceInfo {
  chainIndex: string;
  tokenContractAddress: string;
  price: string;
  marketCap: string;
  priceChange1H: string;
  priceChange24H: string;
  volume24H: string;
  txs24H: string;
  liquidity: string;
  holders: string;
}

export interface SwapQuote {
  chainIndex: string;
  fromToken: TokenInfo;
  toToken: TokenInfo;
  fromTokenAmount: string;
  toTokenAmount: string;
  estimateGasFee: string;
  priceImpactPercentage: string;
  dexRouterList: DexRoute[];
  quoteCompareList: QuoteCompare[];
}

export interface TokenInfo {
  tokenContractAddress: string;
  tokenSymbol: string;
  decimal: string;
  tokenUnitPrice: string;
  isHoneyPot: boolean;
  taxRate: string;
}

export interface DexRoute {
  router: string;
  routerPercent: string;
  subRouterList: unknown[];
}

export interface QuoteCompare {
  dexName: string;
  amountOut: string;
  tradeFee: string;
}

export interface SwapTxData {
  from: string;
  to: string;
  value: string;
  data: string;
  gas: string;
  gasPrice: string;
  minReceiveAmount: string;
}

export interface SwapResponse {
  routerResult: SwapQuote;
  tx: SwapTxData;
}

export interface SignalItem {
  timestamp: string;
  chainIndex: string;
  token: {
    tokenAddress: string;
    symbol: string;
    name: string;
    marketCapUsd: string;
    holders: string;
  };
  price: string;
  walletType: string;
  triggerWalletCount: string;
  amountUsd: string;
}

export interface HotToken {
  chainIndex: string;
  tokenContractAddress: string;
  tokenSymbol: string;
  tokenName: string;
  price: string;
  priceChange24H: string;
  volume24H: string;
  marketCap: string;
  liquidity: string;
  holders: string;
}

export interface TokenAdvancedInfo {
  chainIndex: string;
  tokenContractAddress: string;
  tokenTags: string[];
  riskControlLevel: string;
  top10HoldPercent: string;
  devHoldingPercent: string;
  devRugPullTokenCount: string;
  devCreateTokenCount: string;
}

export interface DeFiProduct {
  investmentId: string;
  investmentName: string;
  platformName: string;
  network: string;
  rate: string;
  tvl: string;
  tokenSymbol: string;
}

export interface WalletTokenBalance {
  chainIndex: string;
  tokenAddress: string;
  symbol: string;
  balance: string;
  tokenPrice: string;
  tokenType: string;
  isRiskToken: boolean;
}

export interface LeaderboardEntry {
  walletAddress: string;
  pnl: string;
  winRate: string;
  txCount: string;
  volume: string;
  roi: string;
}

export interface MemePumpToken {
  chainIndex: string;
  tokenContractAddress: string;
  tokenSymbol: string;
  tokenName: string;
  stage: string;
  marketCapUsd: string;
  holders: string;
  devStillHolding: boolean;
}
