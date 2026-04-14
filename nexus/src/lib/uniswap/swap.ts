import { uniswapPost } from "./client";
import type { UniswapQuoteRequest, UniswapQuoteResponse, UniswapSwapResponse, ApprovalCheckResponse } from "./types";

const XLAYER_CHAIN_ID = 196;

export async function getQuote(params: { fromToken: string; toToken: string; amount: string; swapper: string }): Promise<UniswapQuoteResponse> {
  const request: UniswapQuoteRequest = {
    type: "EXACT_INPUT", amount: params.amount,
    tokenInChainId: XLAYER_CHAIN_ID, tokenOutChainId: XLAYER_CHAIN_ID,
    tokenIn: params.fromToken, tokenOut: params.toToken, swapper: params.swapper,
    routingPreference: "BEST_PRICE",
  };
  return uniswapPost<UniswapQuoteResponse>("/quote", request);
}

export async function getSwapTx(quote: UniswapQuoteResponse): Promise<UniswapSwapResponse> {
  return uniswapPost<UniswapSwapResponse>("/swap", { quote: quote.quote, simulateTransaction: false });
}

export async function checkApproval(params: { walletAddress: string; token: string; amount: string }): Promise<ApprovalCheckResponse> {
  return uniswapPost<ApprovalCheckResponse>("/check_approval", {
    walletAddress: params.walletAddress, token: params.token, amount: params.amount, chainId: XLAYER_CHAIN_ID, includeGasInfo: true,
  });
}
