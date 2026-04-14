import { NextRequest, NextResponse } from "next/server";
import { withX402Payment } from "@/lib/x402/middleware";
import * as okxSignal from "@/lib/okx/signal";
import { db, schema } from "@/lib/db";
import { desc, eq } from "drizzle-orm";

async function handler(_req: NextRequest): Promise<NextResponse> {
  const cached = await db.select().from(schema.intelCache).where(eq(schema.intelCache.type, "whale-moves")).orderBy(desc(schema.intelCache.createdAt)).limit(1);
  if (cached.length > 0 && Date.now() - cached[0].createdAt.getTime() < 5 * 60 * 1000) return NextResponse.json(JSON.parse(cached[0].data));
  const signals = await okxSignal.getWhaleSignals("100000");
  const result = {
    timestamp: new Date().toISOString(), chain: "X Layer (196)",
    whaleTransactions: signals.map((s) => ({ token: s.token.symbol, tokenAddress: s.token.tokenAddress, amountUSD: s.amountUsd, walletType: s.walletType, whaleCount: s.triggerWalletCount, price: s.price, marketCap: s.token.marketCapUsd, time: s.timestamp })),
  };
  await db.insert(schema.intelCache).values({ type: "whale-moves", data: JSON.stringify(result) });
  return NextResponse.json(result);
}

export const GET = withX402Payment("0.02", "Recent whale transactions (>$100K)", handler);
