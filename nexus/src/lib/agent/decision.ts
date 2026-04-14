import Anthropic from "@anthropic-ai/sdk";
import type { AgentDecision } from "./types";

const anthropic = new Anthropic();

const DECISION_SYSTEM_PROMPT = `You are Nexus, an autonomous AI trading agent operating on X Layer.
You analyze market data and make trading/DeFi decisions.

Rules:
- Be conservative. Only recommend trades with clear signals.
- Set confidence between 0 and 1. Only high-confidence trades (>0.6) will execute.
- Always explain your reasoning clearly.
- Consider risk: avoid tokens with suspicious signals.
- Amounts are in USD.

Output ONLY valid JSON matching this schema:
{
  "actions": [
    {
      "type": "SWAP" | "DEFI_DEPOSIT" | "DEFI_WITHDRAW" | "SKIP",
      "reason": "string explaining why",
      "confidence": 0.0 to 1.0,
      "fromToken": "symbol (for SWAP)",
      "toToken": "symbol (for SWAP)",
      "amount": "USD amount as string",
      "protocol": "protocol name (for DEFI)"
    }
  ],
  "intelReport": "2-3 sentence market intelligence summary for x402 API",
  "marketSummary": "1 sentence overall market state"
}`;

export async function makeDecision(marketData: string): Promise<AgentDecision> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: DECISION_SYSTEM_PROMPT,
    messages: [{ role: "user", content: `Analyze this market data and decide what actions to take:\n\n${marketData}` }],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block as { type: "text"; text: string }).text)
    .join("");

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse decision JSON from Claude response");

  const decision = JSON.parse(jsonMatch[0]) as AgentDecision;
  decision.timestamp = new Date().toISOString();
  return decision;
}
