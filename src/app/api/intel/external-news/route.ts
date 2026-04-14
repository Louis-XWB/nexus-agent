import { NextRequest, NextResponse } from "next/server";
import { withX402Payment } from "@/lib/x402/middleware";

async function handler(_req: NextRequest): Promise<NextResponse> {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    headlines: [
      { title: "X Layer TVL reaches new ATH", sentiment: "bullish", source: "DeFi Pulse" },
      { title: "OKB staking rewards increase", sentiment: "bullish", source: "OKX Blog" },
      { title: "New DeFi protocol launches on X Layer", sentiment: "neutral", source: "CoinDesk" },
    ],
  });
}

export const GET = withX402Payment("0.01", "Market news feed", handler);
