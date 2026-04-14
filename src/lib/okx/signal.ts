import { okxPost, okxGet } from "./client";
import type { SignalItem, LeaderboardEntry } from "./types";

const CHAIN_INDEX = "196";

export async function getSignalList(options?: { walletType?: string; minAmountUsd?: string; limit?: string }): Promise<SignalItem[]> {
  return okxPost<SignalItem[]>("/api/v6/dex/market/signal/list", { chainIndex: CHAIN_INDEX, ...options });
}

export async function getWhaleSignals(minAmountUsd: string = "100000"): Promise<SignalItem[]> {
  return getSignalList({ walletType: "3", minAmountUsd });
}

export async function getSmartMoneySignals(): Promise<SignalItem[]> {
  return getSignalList({ walletType: "1" });
}

export async function getLeaderboard(timeFrame: string = "4", sortBy: string = "1"): Promise<LeaderboardEntry[]> {
  return okxGet<LeaderboardEntry[]>("/api/v6/dex/market/leaderboard/list", { chainIndex: CHAIN_INDEX, timeFrame, sortBy });
}
