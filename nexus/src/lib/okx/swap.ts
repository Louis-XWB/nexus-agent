import { okxGet } from "./client";
import type { SwapQuote, SwapResponse } from "./types";

const CHAIN_INDEX = "196";

export async function getSwapQuote(params: { fromTokenAddress: string; toTokenAddress: string; amount: string }): Promise<SwapQuote[]> {
  return okxGet<SwapQuote[]>("/api/v6/dex/aggregator/quote", {
    chainIndex: CHAIN_INDEX, swapMode: "exactIn",
    fromTokenAddress: params.fromTokenAddress, toTokenAddress: params.toTokenAddress, amount: params.amount,
  });
}

export async function getSwapTx(params: { fromTokenAddress: string; toTokenAddress: string; amount: string; slippagePercent: string; userWalletAddress: string }): Promise<SwapResponse[]> {
  return okxGet<SwapResponse[]>("/api/v6/dex/aggregator/swap", {
    chainIndex: CHAIN_INDEX, swapMode: "exactIn", ...params,
  });
}

export async function getApproveTransaction(tokenAddress: string, approveAmount: string): Promise<unknown[]> {
  return okxGet<unknown[]>("/api/v6/dex/aggregator/approve-transaction", { chainIndex: CHAIN_INDEX, tokenContractAddress: tokenAddress, approveAmount });
}
