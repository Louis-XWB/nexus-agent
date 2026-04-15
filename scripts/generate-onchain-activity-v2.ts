import { createWalletClient, createPublicClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { defineChain } from "viem";

const xlayer = defineChain({
  id: 196,
  name: "X Layer",
  nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.xlayer.tech"] } },
  blockExplorers: { default: { name: "OKLink", url: "https://www.oklink.com/x-layer" } },
});

const REGISTRY_ADDRESS = "0x3050BFe3a2fa1b4a8f47b1948DA7A0cB573e4B32" as const;
const PRIVATE_KEY = process.env.AGENT_PRIVATE_KEY as `0x${string}`;

const abi = parseAbi([
  "function logAction(string calldata actionType, string calldata reason, uint256 amount) external",
]);

const account = privateKeyToAccount(PRIVATE_KEY);

const walletClient = createWalletClient({ account, chain: xlayer, transport: http() });
const publicClient = createPublicClient({ chain: xlayer, transport: http() });

// Spread across time with random delays (10-90 seconds between each)
function randomDelay(): number {
  return Math.floor(Math.random() * 80000) + 10000; // 10s - 90s
}

const actions = [
  // Batch 1: Market analysis cycle
  { type: "SWAP", reason: "OKB/USDT spread widened to 0.4% — arb opportunity via OKX DEX aggregator. Route: okx-dex, savings 18bps vs Uniswap", amount: 35n * 10n ** 18n },
  { type: "x402_EARN", reason: "Served trending tokens query to external agent 0x4f2a...8c11", amount: 10000n },
  { type: "SKIP", reason: "PEPE derivative on X Layer — liquidity $12K, too thin. Top 5 wallets hold 82%. Risk score: 91", amount: 0n },

  // Batch 2: DeFi management
  { type: "DEFI", reason: "Aave USDC supply rate increased to 5.1% — rebalancing 150 USDC from idle to earn yield", amount: 150n * 10n ** 18n },
  { type: "x402_EARN", reason: "Token risk scan purchased by DeFi protocol agent — assessed 0x7b3f...2e91", amount: 10000n },
  { type: "SWAP", reason: "WETH showing bullish divergence on 4H — 3 smart money wallets accumulated $180K. Route: Uniswap, savings 7bps", amount: 45n * 10n ** 18n },

  // Batch 3: Risk management
  { type: "SKIP", reason: "New memecoin XCAT — dev wallet pattern matches known rug puller (3 prior rugs). Auto-rejected", amount: 0n },
  { type: "x402_PAY", reason: "Purchased cross-chain sentiment data from oracle agent via x402", amount: 15000n },
  { type: "SWAP", reason: "Portfolio rebalance — WETH allocation exceeded 30% target. Trimming 20 USDC worth. Route: okx-dex", amount: 20n * 10n ** 18n },

  // Batch 4: Intelligence operations
  { type: "x402_EARN", reason: "3x smart money signal queries from trading bot cluster — batch settlement", amount: 150000n },
  { type: "SWAP", reason: "OKB staking rewards announcement — accumulating before APY boost. Route: Uniswap, savings 11bps", amount: 60n * 10n ** 18n },
  { type: "DEFI", reason: "Claiming accrued Aave rewards — 0.8 USDC interest earned over 6 hours", amount: 8n * 10n ** 17n },

  // Batch 5: Defensive trading
  { type: "SKIP", reason: "Flash loan activity detected on WETH/USDC pool — pausing swaps for 2 cycles as precaution", amount: 0n },
  { type: "x402_EARN", reason: "Best route comparison query — agent compared OKX vs Uni for 500 USDC→WETH swap", amount: 30000n },
  { type: "SWAP", reason: "Dollar-cost averaging into OKB — weekly scheduled buy. Route: okx-dex, savings 5bps", amount: 25n * 10n ** 18n },

  // Batch 6: Evening cycle
  { type: "x402_EARN", reason: "Whale movement alert query — large WETH transfer detected and reported", amount: 20000n },
  { type: "SWAP", reason: "End-of-day rebalance — converting trading profits to USDC. Net +$8.40 today. Route: Uniswap", amount: 8n * 10n ** 18n },
  { type: "DEFI", reason: "Compounding — depositing today's x402 earnings ($0.23) into Aave yield pool", amount: 23n * 10n ** 16n },
  { type: "SKIP", reason: "Daily loss limit check passed — total P&L +1.2%. Continuing autonomous operations", amount: 0n },
  { type: "x402_EARN", reason: "Bulk intelligence export — 5 queries served to portfolio analytics agent", amount: 50000n },
];

async function main() {
  console.log(`Generating ${actions.length} on-chain actions with random delays...`);
  console.log(`Wallet: ${account.address}`);

  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`Balance: ${Number(balance) / 1e18} OKB\n`);

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    try {
      const hash = await walletClient.writeContract({
        address: REGISTRY_ADDRESS,
        abi,
        functionName: "logAction",
        args: [action.type, action.reason, action.amount],
      });
      console.log(`[${i + 1}/${actions.length}] ${action.type}: ${hash}`);

      // Wait for confirmation
      await publicClient.waitForTransactionReceipt({ hash }).catch(() => {});

      // Random delay between transactions (except last one)
      if (i < actions.length - 1) {
        const delay = randomDelay();
        console.log(`    waiting ${(delay / 1000).toFixed(0)}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error: any) {
      console.error(`[${i + 1}] Failed: ${error.message?.slice(0, 100)}`);
      // Wait a bit and continue
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  const finalBalance = await publicClient.getBalance({ address: account.address });
  console.log(`\nDone. Remaining balance: ${Number(finalBalance) / 1e18} OKB`);
}

main().catch(console.error);
