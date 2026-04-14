import { NextRequest, NextResponse } from "next/server";
import { withX402Payment } from "@/lib/x402/middleware";
import * as okxSecurity from "@/lib/okx/security";

async function handler(req: NextRequest, ctx: { params: Promise<{ address: string }> }): Promise<NextResponse> {
  const { address } = await ctx.params;
  const risk = await okxSecurity.getTokenRisk(address);
  const score = okxSecurity.getRiskScore(risk);
  return NextResponse.json({
    timestamp: new Date().toISOString(), chain: "X Layer (196)", tokenAddress: address, riskScore: score,
    isHighRisk: okxSecurity.isHighRisk(risk), riskLevel: risk.riskControlLevel, tags: risk.tokenTags,
    holderConcentration: { top10Percent: risk.top10HoldPercent, devPercent: risk.devHoldingPercent },
    devStats: { rugPullCount: risk.devRugPullTokenCount, tokenCount: risk.devCreateTokenCount },
  });
}

export const GET = (req: NextRequest, ctx: { params: Promise<{ address: string }> }) =>
  withX402Payment("0.01", "Token security risk assessment", (r) => handler(r, ctx))(req);
