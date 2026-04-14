# Nexus - Autonomous On-Chain AI Intelligence Agent

> Build X Hackathon Season 2 | X Layer Arena | Solo Developer

## 1. Overview

**Nexus** is an autonomous AI agent that operates a complete on-chain intelligence business on X Layer. It continuously analyzes market data, executes cross-DEX trades, manages DeFi positions, and sells premium intelligence via x402 micropayment APIs — forming a self-sustaining earn-pay-re-earn economic loop.

### Value Proposition

- For **users**: A conversational AI that manages your DeFi portfolio with transparent reasoning
- For **other agents**: An x402-powered intelligence API for on-chain data
- For **X Layer ecosystem**: Drives real transaction volume and demonstrates the full Onchain OS + Uniswap skill stack

### Target Prizes

| Prize | How Nexus Qualifies |
|-------|-------------------|
| 1st Place (5,000 USDT) | Max skill integration + complete product + great UX |
| Best x402 App (500 USDT) | 5 x402 paid API endpoints + agent-as-consumer |
| Most Active Agent (500 USDT) | 48 autonomous cycles/day = high transaction volume |
| Best MCP Integration (500 USDT) | Full OnchainOS MCP skill coverage |
| Best Economic Loop (500 USDT) | 3 revenue streams → 2 expense channels → reinvest |

## 2. System Architecture

```
User <-> [Web UI: Chat + Dashboard]
              |
         [AI Agent Core (Claude API + Tool Calling)]
         +--------+--------+-----------+
         |        |        |           |
         v        v        v           v
    Intelligence  Trading   DeFi     x402 Service
    Engine        Engine    Manager  Layer
         |        |        |           |
         +--------+--------+-----------+
              |
    [OnchainOS REST API + Uniswap Trading API]
              |
         [X Layer (Chain ID 196)]
         Agentic Wallet (TEE) + NexusRegistry.sol
```

### Operating Modes

| Mode | Trigger | Description |
|------|---------|-------------|
| Passive | User chat message | User gives commands via natural language |
| Autonomous | Every 30 minutes | Agent runs SENSE → THINK → ACT → REPORT cycle |
| Service | External HTTP request | Other agents/users query x402 intelligence APIs |

## 3. Tech Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Full-stack framework | Next.js 14 (App Router) | Single codebase for frontend + API |
| Language | TypeScript | Full-stack type safety |
| UI | Tailwind CSS + shadcn/ui | Fast, polished components |
| AI | Claude API (tool calling) | Agent decision-making + user chat |
| Database | SQLite + Drizzle ORM | Zero-config, local-first |
| Web3 | viem | Type-safe, lightweight |
| Charts | Lightweight Charts | Professional financial charts |
| x402 Server | @x402/server | Official x402 middleware |
| Smart Contracts | Foundry (Solidity) | X Layer deployment |
| Font | Inter (UI) + JetBrains Mono (data) | Professional terminal aesthetic |

### Design Style

- Dark theme with tech-blue + dark purple gradients
- Bloomberg Terminal-inspired professional feel
- Subtle real-time data update animations
- Desktop-first, basic mobile responsiveness

## 4. OnchainOS + Uniswap Skills Integration

### OnchainOS Skills (12 of 13)

| Skill | Usage in Nexus | Subsystem |
|-------|---------------|-----------|
| `okx-agentic-wallet` | Wallet lifecycle, balance, send, sign | All |
| `okx-wallet-portfolio` | Portfolio valuation, token holdings | Dashboard, Agent |
| `okx-security` | Token risk assessment, phishing detection, pre-execution simulation | Trading |
| `okx-dex-market` | Live pricing, candlestick data | Intelligence, Chat |
| `okx-dex-signal` | Whale tracking, smart money signals, KOL monitoring | Intelligence |
| `okx-dex-trenches` | Meme token detection, dev reputation scoring | Intelligence |
| `okx-dex-swap` | Execute swaps via 500+ DEX aggregation | Trading |
| `okx-dex-token` | Token discovery, trending, metadata, holder analysis | Intelligence, Chat |
| `okx-onchain-gateway` | Gas estimation, tx simulation, broadcasting | Trading |
| `okx-x402-payment` | Sign x402 payment authorizations | x402 Service |
| `okx-defi-invest` | Deposit/withdraw/claim from DeFi protocols | DeFi Manager |
| `okx-defi-portfolio` | Cross-protocol position monitoring | Dashboard, Agent |

The 13th skill `okx-audit-log` will be included for audit export — it adds minimal implementation cost and brings us to 13/13 coverage.

### Uniswap Skills (3 plugins)

| Plugin / Skill | Usage in Nexus |
|----------------|---------------|
| `swap-integration` | Execute swaps on Uniswap (compared with OKX DEX for best route) |
| `pay-with-any-token` | x402 payments auto-swap any token to required payment token |
| `swap-planner` | Plan optimal swap routes, estimate prices, generate deep links |

### Cross-DEX Route Comparison Flow

Every trade triggers parallel route queries:

1. Query OKX DEX aggregator via `okx-dex-swap` → Quote A
2. Query Uniswap via `swap-planner` → Quote B
3. Compare price, slippage, gas → select best
4. Security scan via `okx-security`
5. Pre-execution simulation via `okx-onchain-gateway`
6. Execute via the winning route
7. Log action on-chain via `NexusRegistry.logAction()`

## 5. x402 Intelligence Market

### Paid API Endpoints

| Endpoint | Data | Price |
|----------|------|-------|
| `GET /api/intel/trending` | Top trending tokens on X Layer (market cap, volume, change) | $0.01 |
| `GET /api/intel/whale-moves` | Recent whale transactions (>$100K) | $0.02 |
| `GET /api/intel/smart-money` | Smart money wallet portfolio changes | $0.05 |
| `GET /api/intel/token-risk/:address` | Token security score + risk details | $0.01 |
| `GET /api/intel/best-route/:from/:to/:amount` | Cross-DEX optimal route comparison | $0.03 |

### x402 Flow

```
External agent → GET /api/intel/whale-moves
                ← HTTP 402 + payment requirements (USDC on X Layer, $0.02)
External agent → Retry with PAYMENT-SIGNATURE header
Nexus          → Verify signature → Facilitator settles on-chain
                ← HTTP 200 + whale transaction data
```

### Agent as Consumer

Nexus also consumes external x402 services, demonstrating bidirectional x402 usage. We will deploy a simple "Market News Feed" x402 endpoint (a separate Next.js API route) that Nexus pays $0.01 per call to fetch summarized market news. This creates a concrete, demo-able agent-as-consumer flow.

## 6. Economic Loop

### Revenue Streams (3)

| Source | Mechanism |
|--------|----------|
| Intelligence API | x402 micropayments per query |
| DeFi Yield | Idle funds deposited to Aave/Lido etc. |
| Trading Profits | Signal-based buy low / sell high |

### Expense Channels (2)

| Expense | Mechanism |
|---------|----------|
| Trading Capital | Reinvest profits into more trades |
| External Data | Purchase x402 services from other agents |

### Loop

```
EARN (x402 sales + DeFi yield + trading profits)
  → AI Capital Allocation Decision
    → REINVEST (more trading capital)
    → DEPOSIT (DeFi for yield)
    → PAY (external x402 services)
      → Better data → Better decisions → More earnings
```

## 7. Autonomous Agent Loop

Runs every 30 minutes in 4 phases:

### Phase 1: SENSE

| Step | Skill | Output |
|------|-------|--------|
| Market overview | `okx-dex-market` | Prices, candlesticks |
| Trending tokens | `okx-dex-token` | Trend rankings |
| Whale signals | `okx-dex-signal` | Large holder movements |
| Meme scan | `okx-dex-trenches` | New tokens, risk flags |
| Current holdings | `okx-wallet-portfolio` | Asset distribution |
| DeFi positions | `okx-defi-portfolio` | Protocol positions |

### Phase 2: THINK

Claude API with tool calling analyzes all data and outputs a structured action plan:

```json
{
  "actions": [
    {
      "type": "SWAP",
      "reason": "WETH whale accumulation detected over 3 hours",
      "from": "USDC",
      "to": "WETH",
      "amount": "50",
      "confidence": 0.78
    },
    {
      "type": "DEFI_DEPOSIT",
      "reason": "Idle USDC exceeds reserve, deposit for yield",
      "protocol": "aave",
      "amount": "200"
    }
  ],
  "intel_report": "Summary for x402 API cache..."
}
```

### Phase 3: ACT

For each action:

1. Security check (`okx-security`) — reject if risk score > 70
2. Route comparison (OKX DEX vs Uniswap) — pick best
3. Transaction simulation (`okx-onchain-gateway`)
4. Execute swap (`okx-dex-swap` or `uniswap swap-integration`)
5. DeFi operations (`okx-defi-invest`) if applicable
6. Log on-chain (`NexusRegistry.logAction()`)

### Phase 4: REPORT

1. Record all decisions + results → SQLite
2. Generate intelligence report → update x402 API cache
3. Push updates to Dashboard via SSE

### Safety Rails

| Rule | Implementation |
|------|---------------|
| Max trade size | ≤ 10% of total assets per trade |
| Reserve floor | Always keep ≥ 20% in USDC |
| Confidence threshold | Skip actions with confidence < 0.6 |
| Token blacklist | Auto-reject tokens with okx-security risk > 70 |
| Pre-execution sim | Every trade simulated before execution |
| Daily loss limit | Pause trading if daily loss > 5% |

## 8. Chat Interface

User interacts with the agent via natural language. Claude tool calling maps to the same Skills:

| User Says | Skills Called | Response |
|-----------|-------------|----------|
| "What tokens are trending?" | `okx-dex-token` | Top 10 + analysis |
| "Is this token safe? 0x..." | `okx-security` | Risk score + details |
| "Buy 50 USDC of WETH" | `okx-dex-swap` + `uniswap` compare → execute | Transaction report |
| "How's my portfolio?" | `okx-wallet-portfolio` + `okx-defi-portfolio` | Holdings + P&L |
| "Deposit idle funds to Aave" | `okx-defi-invest` | Deposit confirmation |
| "What are whales buying?" | `okx-dex-signal` | Whale activity report |
| "Pause auto-trading" | Internal state toggle | "Paused. Manual mode." |

## 9. Frontend Pages

### Dashboard (`/`)

- Total assets, daily P&L, x402 revenue, DeFi yield — 4 stat cards
- Asset distribution pie chart + 7-day P&L line chart
- Recent agent actions feed with reasoning

### Chat (`/chat`)

- Full-screen chat interface
- Message bubbles with rich content (route comparisons, tables, tx links)
- Typing indicators, streaming responses

### Intelligence (`/intel`)

- Live intelligence preview (free summary)
- Full report behind x402 paywall with "unlock" flow
- API documentation with curl examples and "try it" buttons
- Usage statistics (calls, revenue, unique users)

### History (`/history`)

- Filterable transaction + decision log table
- Expandable rows showing full AI reasoning + on-chain TX link
- Export capability

## 10. Smart Contract

### NexusRegistry.sol (X Layer, Chain ID 196)

```solidity
contract NexusRegistry {
    // Identity
    address public owner;
    address public agentWallet;

    // Configuration (AI-modifiable via transactions)
    uint256 public maxTradePercent;   // default 10
    uint256 public reservePercent;    // default 20
    uint256 public minConfidence;     // default 60
    uint256 public maxDailyLoss;      // default 5

    // On-chain action log
    event AgentAction(
        string actionType,   // "SWAP" | "DEFI" | "SKIP" | "x402_EARN" | "x402_PAY"
        string reason,
        uint256 amount,
        uint256 timestamp
    );

    event ConfigUpdated(string param, uint256 oldVal, uint256 newVal);

    // Methods
    function logAction(string calldata actionType, string calldata reason, uint256 amount) external onlyAgent;
    function updateConfig(string calldata param, uint256 value) external onlyOwner;
    function setAgent(address newAgent) external onlyOwner;
}
```

### Purpose

- On-chain identity for the agent (hackathon requirement)
- Transparent audit trail visible on block explorer
- Risk parameters stored on-chain for accountability
- Real on-chain activity for "X Layer ecosystem integration" scoring

### Deployment

```bash
forge create --rpc-url https://rpc.xlayer.tech \
  --private-key $KEY \
  src/NexusRegistry.sol:NexusRegistry
```

## 11. Project Structure

```
nexus/
├── contracts/                    # Foundry smart contracts
│   ├── src/NexusRegistry.sol
│   ├── test/NexusRegistry.t.sol
│   └── foundry.toml
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard
│   │   ├── chat/page.tsx
│   │   ├── intel/page.tsx
│   │   ├── history/page.tsx
│   │   └── api/
│   │       ├── chat/route.ts
│   │       ├── agent/route.ts
│   │       └── intel/
│   │           ├── trending/route.ts
│   │           ├── whale-moves/route.ts
│   │           ├── smart-money/route.ts
│   │           ├── token-risk/[address]/route.ts
│   │           └── best-route/[from]/[to]/[amount]/route.ts
│   ├── lib/
│   │   ├── onchain-os/           # OnchainOS API wrappers
│   │   ├── uniswap/              # Uniswap API wrappers
│   │   ├── agent/                # AI agent core
│   │   ├── x402/                 # x402 server middleware
│   │   └── db/                   # Drizzle schema + client
│   └── components/
│       ├── dashboard/
│       ├── chat/
│       ├── intel/
│       └── ui/                   # shadcn/ui components
├── drizzle/                      # DB migrations
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md                     # Hackathon submission README
```

## 12. Environment Variables

```env
# OKX OnchainOS
OKX_API_KEY=
OKX_SECRET_KEY=
OKX_PASSPHRASE=
OKX_PROJECT_ID=

# Claude AI
ANTHROPIC_API_KEY=

# X Layer
XLAYER_RPC_URL=https://rpc.xlayer.tech
AGENT_PRIVATE_KEY=

# x402
X402_FACILITATOR_URL=
```

## 13. README Requirements (Hackathon Submission)

The README must include:

1. **Project Overview** — What Nexus is, what problem it solves
2. **Architecture Overview** — System diagram + tech stack
3. **Deployment Address** — NexusRegistry.sol contract address on X Layer
4. **OnchainOS Skill Usage** — Table of 12 skills and how each is used
5. **Uniswap Skill Usage** — Table of 3 skills and how each is used
6. **How It Works** — Autonomous loop + economic loop explanation
7. **Team** — Solo developer info
8. **X Layer Ecosystem Position** — How Nexus adds value to X Layer

## 14. Scoring Strategy

| Criteria (25% each) | Nexus Strategy |
|---------------------|---------------|
| OnchainOS/Uniswap Integration | 12/13 OnchainOS + 3 Uniswap skills, cross-DEX comparison on every trade |
| X Layer Ecosystem | Deployed contract, zero-gas Agentic Wallet, real transactions, ecosystem value |
| AI Interaction Experience | Natural language chat, transparent reasoning, real-time dashboard |
| Product Completeness | End-to-end working: chat, auto-trading, DeFi, x402 APIs, all connected |

## 15. Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| OKX API rate limits | Cache market data, batch queries, respect 100 req/s |
| Claude API costs | Use concise prompts, cache repeated analyses |
| X Layer DeFi protocol availability | Verify which protocols (Aave, Lido, etc.) are live on X Layer mainnet before implementation; if none available, use okx-defi-invest which handles protocol routing automatically |
| x402 facilitator availability | Include mock facilitator for demo |
| Time pressure | Prioritize: core loop > chat > dashboard > x402 APIs |
