import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:./nexus.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const now = Date.now();
const hour = 3600000;

const actions = [
  { type: "SWAP", reason: "WETH whale accumulation detected — 3 wallets bought >$200K in 2 hours | Route: uniswap (savings: 12 bps)", amount: 50, from: "USDC", to: "WETH", status: "success", confidence: 0.82, route: "uniswap", pnl: 2.3, time: now - 5 * hour },
  { type: "SKIP", reason: "XDOG trending but risk score 78 — honeypot tags detected, dev sold 60% of supply", amount: 0, from: null, to: "XDOG", status: "skipped", confidence: 0.45, route: null, pnl: null, time: now - 4.5 * hour },
  { type: "DEFI_DEPOSIT", reason: "Idle USDC exceeds 20% reserve — depositing to Aave for 4.2% APY", amount: 200, from: "USDC", to: null, status: "success", confidence: 0.91, route: null, pnl: null, time: now - 4 * hour },
  { type: "x402_EARN", reason: "x402 payment received for trending tokens intelligence", amount: 0.01, from: null, to: null, status: "success", confidence: null, route: null, pnl: 0.01, time: now - 3.5 * hour },
  { type: "SWAP", reason: "Smart money accumulating OKB — 5 wallets net bought $500K | Route: okx-dex (savings: 8 bps)", amount: 80, from: "USDC", to: "OKB", status: "success", confidence: 0.75, route: "okx-dex", pnl: 5.1, time: now - 3 * hour },
  { type: "x402_EARN", reason: "x402 payment received for whale movements intelligence", amount: 0.02, from: null, to: null, status: "success", confidence: null, route: null, pnl: 0.02, time: now - 2.5 * hour },
  { type: "SWAP", reason: "Taking profit on WETH position — price up 3.2% since entry | Route: uniswap (savings: 5 bps)", amount: 52.3, from: "WETH", to: "USDC", status: "success", confidence: 0.88, route: "uniswap", pnl: 2.3, time: now - 2 * hour },
  { type: "SKIP", reason: "Market volatility high — daily loss approaching 3%, reducing exposure", amount: 0, from: null, to: null, status: "skipped", confidence: 0.35, route: null, pnl: null, time: now - 1.5 * hour },
  { type: "x402_EARN", reason: "x402 payment received for smart money signals (3 queries)", amount: 0.15, from: null, to: null, status: "success", confidence: null, route: null, pnl: 0.15, time: now - 1 * hour },
  { type: "SWAP", reason: "USDT depeg signal detected — rotating to USDC for safety | Route: okx-dex (savings: 3 bps)", amount: 100, from: "USDT", to: "USDC", status: "success", confidence: 0.92, route: "okx-dex", pnl: 0.5, time: now - 0.5 * hour },
];

const x402txs = [
  { endpoint: "/api/intel/trending", payer: "0xabc1...def1", amount: "0.01", status: "settled", time: now - 3.5 * hour },
  { endpoint: "/api/intel/whale-moves", payer: "0xabc2...def2", amount: "0.02", status: "settled", time: now - 2.5 * hour },
  { endpoint: "/api/intel/smart-money", payer: "0xabc3...def3", amount: "0.05", status: "settled", time: now - 1 * hour },
  { endpoint: "/api/intel/smart-money", payer: "0xabc4...def4", amount: "0.05", status: "settled", time: now - 1 * hour },
  { endpoint: "/api/intel/smart-money", payer: "0xabc5...def5", amount: "0.05", status: "settled", time: now - 1 * hour },
];

async function main() {
  for (const a of actions) {
    await client.execute({
      sql: "INSERT INTO agent_actions (action_type, reason, amount, token_from, token_to, status, confidence, route, pnl, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [a.type, a.reason, a.amount, a.from, a.to, a.status, a.confidence, a.route, a.pnl, Math.floor(a.time / 1000)],
    });
  }

  for (const t of x402txs) {
    await client.execute({
      sql: "INSERT INTO x402_transactions (endpoint, payer_address, amount, status, created_at) VALUES (?, ?, ?, ?, ?)",
      args: [t.endpoint, t.payer, t.amount, t.status, Math.floor(t.time / 1000)],
    });
  }

  console.log(`Seeded ${actions.length} agent actions and ${x402txs.length} x402 transactions`);
}

main().catch(console.error);
