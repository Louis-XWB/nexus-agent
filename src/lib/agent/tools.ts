import type { Tool } from "@anthropic-ai/sdk/resources/messages";
import * as okx from "../okx";
import * as uniswapSwap from "../uniswap/swap";
import { compareRoutes } from "../router";

export const TOOLS: Tool[] = [
  {
    name: "get_trending_tokens",
    description: "Get the top trending tokens on X Layer by score, volume, or market cap",
    input_schema: { type: "object" as const, properties: { limit: { type: "string", description: "Number of tokens (max 20)", default: "10" } }, required: [] },
  },
  {
    name: "get_token_price",
    description: "Get current price and market data for specific tokens on X Layer",
    input_schema: { type: "object" as const, properties: { tokenAddresses: { type: "array", items: { type: "string" }, description: "Token contract addresses" } }, required: ["tokenAddresses"] },
  },
  {
    name: "get_whale_signals",
    description: "Get recent whale transactions (>$100K) on X Layer",
    input_schema: { type: "object" as const, properties: { minAmountUsd: { type: "string", description: "Minimum USD amount", default: "100000" } }, required: [] },
  },
  {
    name: "get_smart_money_signals",
    description: "Get recent smart money wallet activity on X Layer",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "check_token_risk",
    description: "Check security risk assessment for a token",
    input_schema: { type: "object" as const, properties: { tokenAddress: { type: "string", description: "Token contract address" } }, required: ["tokenAddress"] },
  },
  {
    name: "get_best_swap_route",
    description: "Compare swap routes across OKX DEX and Uniswap",
    input_schema: { type: "object" as const, properties: { fromToken: { type: "string" }, toToken: { type: "string" }, amount: { type: "string", description: "Amount in wei" } }, required: ["fromToken", "toToken", "amount"] },
  },
  {
    name: "execute_swap",
    description: "Execute a token swap using the best available route",
    input_schema: { type: "object" as const, properties: { fromToken: { type: "string" }, toToken: { type: "string" }, amount: { type: "string", description: "Amount in wei" }, slippagePercent: { type: "string", default: "1" } }, required: ["fromToken", "toToken", "amount"] },
  },
  {
    name: "get_portfolio",
    description: "Get current wallet portfolio with all token balances",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_defi_positions",
    description: "Get current DeFi positions across all protocols",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_defi_products",
    description: "List available DeFi yield products on X Layer",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "deposit_defi",
    description: "Deposit tokens into a DeFi protocol for yield",
    input_schema: { type: "object" as const, properties: { investmentId: { type: "string" }, amount: { type: "string" }, tokenAddress: { type: "string" } }, required: ["investmentId", "amount"] },
  },
  {
    name: "search_token",
    description: "Search for a token by name, symbol, or address",
    input_schema: { type: "object" as const, properties: { query: { type: "string" } }, required: ["query"] },
  },
  {
    name: "toggle_auto_trading",
    description: "Enable or disable the autonomous trading loop",
    input_schema: { type: "object" as const, properties: { enabled: { type: "boolean" } }, required: ["enabled"] },
  },
];

export async function executeTool(name: string, input: Record<string, unknown>): Promise<string> {
  const walletAddress = process.env.AGENT_WALLET_ADDRESS || "";
  try {
    switch (name) {
      case "get_trending_tokens":
        return JSON.stringify(await okx.token.getHotTokens("4", (input.limit as string) || "10"), null, 2);
      case "get_token_price":
        return JSON.stringify(await okx.market.getTokenPriceInfo(input.tokenAddresses as string[]), null, 2);
      case "get_whale_signals":
        return JSON.stringify(await okx.signal.getWhaleSignals((input.minAmountUsd as string) || "100000"), null, 2);
      case "get_smart_money_signals":
        return JSON.stringify(await okx.signal.getSmartMoneySignals(), null, 2);
      case "check_token_risk": {
        const risk = await okx.security.getTokenRisk(input.tokenAddress as string);
        const score = okx.security.getRiskScore(risk);
        return JSON.stringify({ ...risk, riskScore: score, isHighRisk: okx.security.isHighRisk(risk) }, null, 2);
      }
      case "get_best_swap_route":
        return JSON.stringify(await compareRoutes({ fromToken: input.fromToken as string, toToken: input.toToken as string, amount: input.amount as string, walletAddress }), null, 2);
      case "execute_swap": {
        const comparison = await compareRoutes({ fromToken: input.fromToken as string, toToken: input.toToken as string, amount: input.amount as string, walletAddress });
        let txData;
        if (comparison.best.source === "okx-dex") {
          txData = await okx.swap.getSwapTx({ fromTokenAddress: input.fromToken as string, toTokenAddress: input.toToken as string, amount: input.amount as string, slippagePercent: (input.slippagePercent as string) || "1", userWalletAddress: walletAddress });
        } else {
          const quote = comparison.best.rawQuote as Awaited<ReturnType<typeof uniswapSwap.getQuote>>;
          txData = await uniswapSwap.getSwapTx(quote);
        }
        return JSON.stringify({ route: comparison.best.source, txData }, null, 2);
      }
      case "get_portfolio":
        return JSON.stringify(await okx.wallet.getAllBalances(process.env.OKX_ACCOUNT_ID || ""), null, 2);
      case "get_defi_positions":
        return JSON.stringify(await okx.defi.getUserDeFiPositions(walletAddress), null, 2);
      case "get_defi_products":
        return JSON.stringify(await okx.defi.getDeFiProducts(), null, 2);
      case "deposit_defi":
        return JSON.stringify(await okx.defi.getDeFiSubscriptionTx({ address: walletAddress, investmentId: input.investmentId as string, coinAmount: input.amount as string, tokenAddress: input.tokenAddress as string }), null, 2);
      case "search_token":
        return JSON.stringify(await okx.token.searchToken(input.query as string), null, 2);
      case "toggle_auto_trading": {
        const { db, schema } = await import("../db");
        await db.insert(schema.agentState).values({ key: "auto_trading_enabled", value: String(input.enabled), updatedAt: new Date() })
          .onConflictDoUpdate({ target: schema.agentState.key, set: { value: String(input.enabled), updatedAt: new Date() } });
        return JSON.stringify({ autoTrading: input.enabled });
      }
      default:
        return JSON.stringify({ error: `Unknown tool: ${name}` });
    }
  } catch (error) {
    return JSON.stringify({ error: String(error) });
  }
}
