import type { AgentAction, PortfolioState, SafetyCheckResult } from "./types";
import { db, schema } from "../db";
import { gte, and, eq } from "drizzle-orm";

const MAX_TRADE_PERCENT = 10;
const RESERVE_PERCENT = 20;
const MIN_CONFIDENCE = 0.6;
const MAX_DAILY_LOSS_PERCENT = 5;
const MAX_RISK_SCORE = 70;

export function checkTradeSize(action: AgentAction, portfolio: PortfolioState): SafetyCheckResult {
  if (!action.amount) return { allowed: true };
  const amountUSD = parseFloat(action.amount);
  const maxAllowed = portfolio.totalValueUSD * (MAX_TRADE_PERCENT / 100);
  if (amountUSD > maxAllowed) {
    return { allowed: false, reason: `Trade $${amountUSD} exceeds max ${MAX_TRADE_PERCENT}% of portfolio ($${maxAllowed.toFixed(2)})` };
  }
  return { allowed: true };
}

export function checkReserve(action: AgentAction, portfolio: PortfolioState): SafetyCheckResult {
  if (action.type !== "SWAP" && action.type !== "DEFI_DEPOSIT") return { allowed: true };
  const stableBalance = portfolio.balances
    .filter((b) => ["USDC", "USDT", "USDG"].includes(b.symbol.toUpperCase()))
    .reduce((sum, b) => sum + b.valueUSD, 0);
  const requiredReserve = portfolio.totalValueUSD * (RESERVE_PERCENT / 100);
  const amountUSD = parseFloat(action.amount || "0");
  if (stableBalance - amountUSD < requiredReserve) {
    return { allowed: false, reason: `Would drop stablecoin reserve below ${RESERVE_PERCENT}% ($${requiredReserve.toFixed(2)} required, $${(stableBalance - amountUSD).toFixed(2)} would remain)` };
  }
  return { allowed: true };
}

export function checkConfidence(action: AgentAction): SafetyCheckResult {
  if (action.type === "SKIP") return { allowed: true };
  if (action.confidence < MIN_CONFIDENCE) {
    return { allowed: false, reason: `Confidence ${(action.confidence * 100).toFixed(0)}% below threshold ${MIN_CONFIDENCE * 100}%` };
  }
  return { allowed: true };
}

export function checkTokenRisk(riskScore: number): SafetyCheckResult {
  if (riskScore > MAX_RISK_SCORE) {
    return { allowed: false, reason: `Token risk score ${riskScore} exceeds max ${MAX_RISK_SCORE}` };
  }
  return { allowed: true };
}

export async function checkDailyLoss(portfolio: PortfolioState): Promise<SafetyCheckResult> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysActions = await db.select().from(schema.agentActions)
    .where(and(gte(schema.agentActions.createdAt, today), eq(schema.agentActions.status, "success")));
  const totalPnl = todaysActions.reduce((sum, a) => sum + (a.pnl || 0), 0);
  const lossPercent = Math.abs(Math.min(totalPnl, 0)) / portfolio.totalValueUSD * 100;
  if (lossPercent > MAX_DAILY_LOSS_PERCENT) {
    return { allowed: false, reason: `Daily loss ${lossPercent.toFixed(2)}% exceeds max ${MAX_DAILY_LOSS_PERCENT}%. Trading paused.` };
  }
  return { allowed: true };
}

export async function runAllChecks(action: AgentAction, portfolio: PortfolioState, tokenRiskScore?: number): Promise<SafetyCheckResult> {
  const checks = [
    checkConfidence(action),
    checkTradeSize(action, portfolio),
    checkReserve(action, portfolio),
    await checkDailyLoss(portfolio),
  ];
  if (tokenRiskScore !== undefined) checks.push(checkTokenRisk(tokenRiskScore));
  const failed = checks.find((c) => !c.allowed);
  return failed || { allowed: true };
}
