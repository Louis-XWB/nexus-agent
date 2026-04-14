import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const agentActions = sqliteTable("agent_actions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  actionType: text("action_type").notNull(),
  reason: text("reason").notNull(),
  amount: real("amount"),
  tokenFrom: text("token_from"),
  tokenTo: text("token_to"),
  txHash: text("tx_hash"),
  status: text("status").notNull(),
  confidence: real("confidence"),
  route: text("route"),
  routeDetails: text("route_details"),
  pnl: real("pnl"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const intelCache = sqliteTable("intel_cache", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(),
  data: text("data").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const chatMessages = sqliteTable("chat_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  toolCalls: text("tool_calls"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const agentState = sqliteTable("agent_state", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const x402Transactions = sqliteTable("x402_transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  endpoint: text("endpoint").notNull(),
  payerAddress: text("payer_address").notNull(),
  amount: text("amount").notNull(),
  txHash: text("tx_hash"),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
