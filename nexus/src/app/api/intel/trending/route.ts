import { NextRequest, NextResponse } from "next/server";
import { withX402Payment } from "@/lib/x402/middleware";
import * as okxToken from "@/lib/okx/token";
import { db, schema } from "@/lib/db";
import { desc, eq } from "drizzle-orm";

async function handler(_req: NextRequest): Promise<NextResponse> {
  const cached = await db.select().from(schema.intelCache).where(eq(schema.intelCache.type, "trending")).orderBy(desc(schema.intelCache.createdAt)).limit(1);
  if (cached.length > 0 && Date.now() - cached[0].createdAt.getTime() < 5 * 60 * 1000) {
    return NextResponse.json(JSON.parse(cached[0].data));
  }
  const tokens = await okxToken.getHotTokens("4", "20");
  const result = {
    timestamp: new Date().toISOString(), chain: "X Layer (196)",
    tokens: tokens.map((t) => ({ symbol: t.tokenSymbol, name: t.tokenName, address: t.tokenContractAddress, price: t.price, change24h: t.priceChange24H, volume24h: t.volume24H, marketCap: t.marketCap, liquidity: t.liquidity, holders: t.holders })),
  };
  await db.insert(schema.intelCache).values({ type: "trending", data: JSON.stringify(result) });
  return NextResponse.json(result);
}

export const GET = withX402Payment("0.01", "Top trending tokens on X Layer", handler);
