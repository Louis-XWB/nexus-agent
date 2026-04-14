import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { desc, eq, gte, and, sql } from "drizzle-orm";

export async function GET() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [recentActions, todayStats, x402Stats] = await Promise.all([
    db.select().from(schema.agentActions).orderBy(desc(schema.agentActions.createdAt)).limit(20),
    db.select({ totalPnl: sql<number>`COALESCE(SUM(${schema.agentActions.pnl}), 0)`, actionCount: sql<number>`COUNT(*)` })
      .from(schema.agentActions).where(and(gte(schema.agentActions.createdAt, today), eq(schema.agentActions.status, "success"))),
    db.select({ totalEarnings: sql<number>`COALESCE(SUM(CAST(${schema.x402Transactions.amount} AS REAL)), 0)`, totalCalls: sql<number>`COUNT(*)` })
      .from(schema.x402Transactions).where(eq(schema.x402Transactions.status, "settled")),
  ]);
  return NextResponse.json({
    recentActions, todayPnl: todayStats[0]?.totalPnl ?? 0, todayActionCount: todayStats[0]?.actionCount ?? 0,
    x402Earnings: x402Stats[0]?.totalEarnings ?? 0, x402Calls: x402Stats[0]?.totalCalls ?? 0,
  });
}
