import * as okx from "../okx";
import { makeDecision } from "./decision";
import { runAllChecks } from "./safety";
import { compareRoutes } from "../router";
import { db, schema } from "../db";
import type { PortfolioState, AgentAction } from "./types";
import { eq } from "drizzle-orm";

async function isAutoTradingEnabled(): Promise<boolean> {
  const state = await db.select().from(schema.agentState).where(eq(schema.agentState.key, "auto_trading_enabled")).limit(1);
  return state.length === 0 || state[0].value === "true";
}

async function getPortfolioState(): Promise<PortfolioState> {
  const accountId = process.env.OKX_ACCOUNT_ID || "";
  const balances = await okx.wallet.getAllBalances(accountId);
  const mapped = balances.map((b) => ({
    symbol: b.symbol, address: b.tokenAddress, amount: parseFloat(b.balance), valueUSD: parseFloat(b.balance) * parseFloat(b.tokenPrice || "0"),
  }));
  const totalValueUSD = mapped.reduce((sum, b) => sum + b.valueUSD, 0);
  let defiPositions: { protocol: string; valueUSD: number }[] = [];
  try {
    const positions = await okx.defi.getUserDeFiPositions(process.env.AGENT_WALLET_ADDRESS || "");
    defiPositions = Array.isArray(positions) ? positions.map((p) => {
      const pos = p as { platformName?: string; totalValue?: string };
      return { protocol: pos.platformName || "unknown", valueUSD: parseFloat(pos.totalValue || "0") };
    }) : [];
  } catch { /* DeFi positions may not be available */ }
  return { totalValueUSD, balances: mapped, defiPositions };
}

async function sense(): Promise<string> {
  const [trending, whaleSignals, smartMoney, portfolio] = await Promise.allSettled([
    okx.token.getHotTokens("4", "10"),
    okx.signal.getWhaleSignals("50000"),
    okx.signal.getSmartMoneySignals(),
    getPortfolioState(),
  ]);
  const data: string[] = [];
  data.push("=== TRENDING TOKENS ===");
  data.push(trending.status === "fulfilled" ? JSON.stringify(trending.value.slice(0, 10), null, 2) : "Error: " + trending.reason);
  data.push("\n=== WHALE SIGNALS ===");
  data.push(whaleSignals.status === "fulfilled" ? JSON.stringify(whaleSignals.value.slice(0, 10), null, 2) : "Error: " + whaleSignals.reason);
  data.push("\n=== SMART MONEY ===");
  data.push(smartMoney.status === "fulfilled" ? JSON.stringify(smartMoney.value.slice(0, 10), null, 2) : "Error: " + smartMoney.reason);
  data.push("\n=== CURRENT PORTFOLIO ===");
  data.push(portfolio.status === "fulfilled" ? JSON.stringify(portfolio.value, null, 2) : "Error: " + portfolio.reason);
  return data.join("\n");
}

async function act(action: AgentAction, portfolio: PortfolioState): Promise<{ status: string; txHash?: string; reason?: string }> {
  let riskScore: number | undefined;
  if (action.toToken && action.type === "SWAP") {
    try {
      const risk = await okx.security.getTokenRisk(action.toToken);
      riskScore = okx.security.getRiskScore(risk);
    } catch { /* proceed without risk check */ }
  }
  const safetyCheck = await runAllChecks(action, portfolio, riskScore);
  if (!safetyCheck.allowed) return { status: "skipped", reason: safetyCheck.reason };

  if (action.type === "SWAP" && action.fromToken && action.toToken && action.amount) {
    try {
      const comparison = await compareRoutes({
        fromToken: action.fromToken, toToken: action.toToken, amount: action.amount, walletAddress: process.env.AGENT_WALLET_ADDRESS || "",
      });
      await db.insert(schema.agentActions).values({
        actionType: "SWAP", reason: `${action.reason} | Route: ${comparison.best.source} (savings: ${comparison.savings})`,
        amount: parseFloat(action.amount), tokenFrom: action.fromToken, tokenTo: action.toToken,
        status: "success", confidence: action.confidence, route: comparison.best.source, routeDetails: JSON.stringify(comparison),
      });
      return { status: "success", txHash: "0x_demo" };
    } catch (error) {
      return { status: "failed", reason: String(error) };
    }
  }
  if (action.type === "DEFI_DEPOSIT") {
    await db.insert(schema.agentActions).values({
      actionType: "DEFI_DEPOSIT", reason: action.reason, amount: parseFloat(action.amount || "0"), status: "success", confidence: action.confidence,
    });
    return { status: "success" };
  }
  return { status: "skipped", reason: "Unknown action type" };
}

async function report(decision: Awaited<ReturnType<typeof makeDecision>>, results: { status: string }[]): Promise<void> {
  await db.insert(schema.intelCache).values({
    type: "agent-report",
    data: JSON.stringify({
      intelReport: decision.intelReport, marketSummary: decision.marketSummary,
      actions: decision.actions.map((a, i) => ({ ...a, result: results[i] })), timestamp: decision.timestamp,
    }),
  });
}

export async function runAgentLoop(): Promise<{ success: boolean; actionsExecuted: number; summary: string }> {
  if (!(await isAutoTradingEnabled())) return { success: true, actionsExecuted: 0, summary: "Auto-trading is paused" };
  const marketData = await sense();
  const decision = await makeDecision(marketData);
  const portfolio = await getPortfolioState();
  const results = [];
  for (const action of decision.actions) results.push(await act(action, portfolio));
  await report(decision, results);
  return { success: true, actionsExecuted: results.filter((r) => r.status === "success").length, summary: decision.marketSummary };
}
