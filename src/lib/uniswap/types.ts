export interface UniswapQuoteRequest {
  type: "EXACT_INPUT" | "EXACT_OUTPUT";
  amount: string;
  tokenInChainId: number;
  tokenOutChainId: number;
  tokenIn: string;
  tokenOut: string;
  swapper: string;
  slippageTolerance?: number;
  routingPreference?: "BEST_PRICE" | "FASTEST";
}

export interface UniswapQuoteResponse {
  requestId: string;
  quote: ClassicQuote;
  routing: string;
  permitData: unknown | null;
}

export interface ClassicQuote {
  input: { token: string; amount: string };
  output: { token: string; amount: string; recipient: string };
  swapper: string;
  chainId: number;
  slippage: number;
  tradeType: string;
  gasFee: string;
  gasFeeUSD: string;
  route: unknown[][];
  quoteId: string;
  gasUseEstimate: string;
  priceImpact: number;
}

export interface UniswapSwapRequest {
  quote: ClassicQuote;
  signature?: string;
  permitData?: unknown;
  simulateTransaction?: boolean;
}

export interface UniswapSwapResponse {
  requestId: string;
  swap: { to: string; data: string; value: string; gas: string };
  gasFee: string;
}

export interface ApprovalCheckRequest {
  walletAddress: string;
  token: string;
  amount: string;
  chainId: number;
  includeGasInfo?: boolean;
}

export interface ApprovalCheckResponse {
  requestId: string;
  approval: { to: string; data: string; value: string } | null;
  gasFee: string;
}
