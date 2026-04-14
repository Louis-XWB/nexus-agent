import { describe, it, expect } from "vitest";
import { checkTradeSize, checkReserve, checkConfidence, checkTokenRisk } from "../src/lib/agent/safety";
import type { AgentAction, PortfolioState } from "../src/lib/agent/types";

const mockPortfolio: PortfolioState = {
  totalValueUSD: 1000,
  balances: [
    { symbol: "USDC", address: "0x1", amount: 500, valueUSD: 500 },
    { symbol: "WETH", address: "0x2", amount: 0.2, valueUSD: 500 },
  ],
  defiPositions: [],
};

const mockAction: AgentAction = {
  type: "SWAP", reason: "test", confidence: 0.8, fromToken: "USDC", toToken: "WETH", amount: "50",
};

describe("checkTradeSize", () => {
  it("allows trade within limit", () => {
    expect(checkTradeSize(mockAction, mockPortfolio).allowed).toBe(true);
  });
  it("rejects trade exceeding 10% of portfolio", () => {
    const result = checkTradeSize({ ...mockAction, amount: "150" }, mockPortfolio);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("exceeds max");
  });
});

describe("checkReserve", () => {
  it("allows trade keeping reserve above 20%", () => {
    expect(checkReserve(mockAction, mockPortfolio).allowed).toBe(true);
  });
  it("rejects trade that would drop reserve below 20%", () => {
    const result = checkReserve({ ...mockAction, amount: "400" }, mockPortfolio);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("reserve");
  });
});

describe("checkConfidence", () => {
  it("allows high confidence action", () => {
    expect(checkConfidence(mockAction).allowed).toBe(true);
  });
  it("rejects low confidence action", () => {
    const result = checkConfidence({ ...mockAction, confidence: 0.3 });
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Confidence");
  });
  it("always allows SKIP actions", () => {
    expect(checkConfidence({ type: "SKIP", reason: "test", confidence: 0.1 }).allowed).toBe(true);
  });
});

describe("checkTokenRisk", () => {
  it("allows low risk token", () => {
    expect(checkTokenRisk(30).allowed).toBe(true);
  });
  it("rejects high risk token", () => {
    const result = checkTokenRisk(85);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("risk score");
  });
});
