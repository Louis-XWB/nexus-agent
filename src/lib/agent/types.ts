export type ActionType = "SWAP" | "DEFI_DEPOSIT" | "DEFI_WITHDRAW" | "SKIP" | "x402_EARN" | "x402_PAY";

export interface AgentAction {
  type: ActionType;
  reason: string;
  confidence: number;
  fromToken?: string;
  toToken?: string;
  amount?: string;
  protocol?: string;
}

export interface AgentDecision {
  actions: AgentAction[];
  intelReport: string;
  marketSummary: string;
  timestamp: string;
}

export interface PortfolioState {
  totalValueUSD: number;
  balances: { symbol: string; address: string; amount: number; valueUSD: number }[];
  defiPositions: { protocol: string; valueUSD: number }[];
}

export interface SafetyCheckResult {
  allowed: boolean;
  reason?: string;
}
