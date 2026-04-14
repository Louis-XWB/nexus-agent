import { okxPost, okxGet } from "./client";
import type { TokenPriceInfo } from "./types";

const CHAIN_INDEX = "196";

export async function getTokenPriceInfo(tokenAddresses: string[]): Promise<TokenPriceInfo[]> {
  return okxPost<TokenPriceInfo[]>("/api/v6/dex/market/price-info", {
    chainIndex: CHAIN_INDEX,
    tokenContractAddress: tokenAddresses.join(","),
  });
}

export async function getIndexPrice(
  tokens: { chainIndex: string; tokenContractAddress: string }[]
): Promise<{ price: string; time: string }[]> {
  return okxPost<{ price: string; time: string }[]>("/api/v6/dex/index/current-price", tokens);
}

export async function getCandles(tokenAddress: string, bar: string = "1H"): Promise<unknown[]> {
  return okxGet<unknown[]>("/api/v6/dex/market/candles", { chainIndex: CHAIN_INDEX, tokenContractAddress: tokenAddress, bar });
}
