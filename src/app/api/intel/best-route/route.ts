import { NextRequest, NextResponse } from "next/server";
import { withX402Payment } from "@/lib/x402/middleware";
import { compareRoutes } from "@/lib/router";

async function handler(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const fromToken = searchParams.get("from");
  const toToken = searchParams.get("to");
  const amount = searchParams.get("amount");
  if (!fromToken || !toToken || !amount) return NextResponse.json({ error: "Missing required params: from, to, amount" }, { status: 400 });
  const comparison = await compareRoutes({ fromToken, toToken, amount, walletAddress: process.env.AGENT_WALLET_ADDRESS || "" });
  return NextResponse.json({
    timestamp: new Date().toISOString(), chain: "X Layer (196)", bestRoute: comparison.best.source, savings: comparison.savings,
    quotes: comparison.all.map((q) => ({ source: q.source, outputAmount: q.toAmount, gasEstimate: q.gasEstimate, priceImpact: q.priceImpact })),
  });
}

export const GET = withX402Payment("0.03", "Cross-DEX optimal route comparison", handler);
