import { db, schema } from "../db";
import { desc } from "drizzle-orm";

export async function exportAuditLog(limit: number = 100): Promise<unknown[]> {
  const actions = await db.select().from(schema.agentActions).orderBy(desc(schema.agentActions.createdAt)).limit(limit);
  return actions.map((a) => ({
    id: a.id, type: a.actionType, reason: a.reason, amount: a.amount,
    tokens: { from: a.tokenFrom, to: a.tokenTo }, txHash: a.txHash,
    status: a.status, confidence: a.confidence, route: a.route, pnl: a.pnl, timestamp: a.createdAt,
  }));
}

export async function getAuditSummary(): Promise<{ totalActions: number; successRate: number; totalPnl: number }> {
  const actions = await db.select().from(schema.agentActions);
  const total = actions.length;
  const successful = actions.filter((a) => a.status === "success").length;
  const pnl = actions.reduce((sum, a) => sum + (a.pnl || 0), 0);
  return { totalActions: total, successRate: total > 0 ? successful / total : 0, totalPnl: pnl };
}
