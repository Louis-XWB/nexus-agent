import { okxGet } from "./client";
import type { TokenAdvancedInfo } from "./types";

const CHAIN_INDEX = "196";

export async function getTokenRisk(tokenAddress: string): Promise<TokenAdvancedInfo> {
  const data = await okxGet<TokenAdvancedInfo[]>("/api/v6/dex/market/token/advanced-info", { chainIndex: CHAIN_INDEX, tokenContractAddress: tokenAddress });
  return data[0];
}

export function isHighRisk(info: TokenAdvancedInfo): boolean {
  const riskLevel = parseInt(info.riskControlLevel || "0");
  const hasHoneypot = info.tokenTags?.includes("honeypot");
  const highDevHolding = parseFloat(info.devHoldingPercent || "0") > 50;
  const rugPullHistory = parseInt(info.devRugPullTokenCount || "0") > 0;
  return riskLevel >= 4 || hasHoneypot || highDevHolding || rugPullHistory;
}

export function getRiskScore(info: TokenAdvancedInfo): number {
  let score = 0;
  const riskLevel = parseInt(info.riskControlLevel || "0");
  score += riskLevel * 15;
  if (info.tokenTags?.includes("honeypot")) score += 30;
  if (info.tokenTags?.includes("lowLiquidity")) score += 10;
  if (parseFloat(info.devHoldingPercent || "0") > 30) score += 15;
  if (parseInt(info.devRugPullTokenCount || "0") > 0) score += 20;
  if (parseFloat(info.top10HoldPercent || "0") > 80) score += 10;
  return Math.min(score, 100);
}
