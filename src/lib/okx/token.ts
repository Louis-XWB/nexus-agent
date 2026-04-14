import { okxGet } from "./client";
import type { HotToken, MemePumpToken } from "./types";

const CHAIN_INDEX = "196";

export async function getHotTokens(rankingType: string = "4", limit: string = "20"): Promise<HotToken[]> {
  return okxGet<HotToken[]>("/api/v6/dex/market/token/hot-token", { chainIndex: CHAIN_INDEX, rankingType, limit });
}

export async function searchToken(query: string): Promise<unknown[]> {
  return okxGet<unknown[]>("/api/v6/dex/market/token/search", { chains: CHAIN_INDEX, search: query, limit: "10" });
}

export async function getMemePumpTokens(stage: string = "MIGRATED"): Promise<MemePumpToken[]> {
  return okxGet<MemePumpToken[]>("/api/v6/dex/market/memepump/tokenList", { chainIndex: CHAIN_INDEX, stage, limit: "20" });
}
